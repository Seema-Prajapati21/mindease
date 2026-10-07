package com.mindease.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.mindease.model.MoodEntry;
import com.mindease.model.User;
import com.mindease.repository.MoodEntryRepository;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.plot.XYPlot;
import org.jfree.chart.renderer.xy.XYLineAndShapeRenderer;
import org.jfree.data.xy.XYSeries;
import org.jfree.data.xy.XYSeriesCollection;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PdfSummaryService {

    private final MoodEntryRepository moodEntryRepository;
    private final AuthService authService;

    public PdfSummaryService(MoodEntryRepository moodEntryRepository, AuthService authService) {
        this.moodEntryRepository = moodEntryRepository;
        this.authService = authService;
    }

    public byte[] generateWellnessPdf(String userEmail, String fromDate, String toDate) throws Exception {
        User user = authService.getMe(userEmail);
        List<MoodEntry> entries = moodEntryRepository.findByUserIdAndDateBetweenOrderByDateAsc(user.getId(), fromDate, toDate);

        Document document = new Document(PageSize.A4, 40, 40, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        // Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(46, 46, 46));
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, new Color(143, 166, 142));
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(46, 46, 46));
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(70, 70, 70));
        Font textMuted = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, new Color(138, 138, 138));

        // Header Title
        Paragraph title = new Paragraph("MindEase — Personal Wellness Summary", titleFont);
        title.setSpacingAfter(4);
        document.add(title);

        Paragraph tagline = new Paragraph("Data with a heartbeat • Private & Reflective", subtitleFont);
        tagline.setSpacingAfter(15);
        document.add(tagline);

        Paragraph meta = new Paragraph(String.format("Prepared for: %s | Range: %s to %s", user.getName(), fromDate, toDate), textFont);
        meta.setSpacingAfter(20);
        document.add(meta);

        // Summary Stats
        PdfPTable statsTable = new PdfPTable(3);
        statsTable.setWidthPercentage(100);
        statsTable.setSpacingAfter(20);

        statsTable.addCell(createStatCell("Total Check-Ins", String.valueOf(entries.size()), textFont, headerFont));
        double avgScore = entries.stream().mapToInt(MoodEntry::getIntensity).average().orElse(5.0);
        statsTable.addCell(createStatCell("Avg Intensity", String.format("%.1f / 10", avgScore), textFont, headerFont));
        long daysLogged = entries.stream().map(MoodEntry::getDate).distinct().count();
        statsTable.addCell(createStatCell("Active Days", String.valueOf(daysLogged), textFont, headerFont));
        document.add(statsTable);

        // Chart with JFreeChart
        if (!entries.isEmpty()) {
            XYSeries series = new XYSeries("Mood Intensity");
            for (int i = 0; i < entries.size(); i++) {
                series.add(i + 1, entries.get(i).getIntensity());
            }
            XYSeriesCollection dataset = new XYSeriesCollection(series);
            JFreeChart chart = ChartFactory.createXYLineChart(
                    "Check-In Intensity Trajectory",
                    "Sequential Entries",
                    "Intensity (1-10)",
                    dataset,
                    PlotOrientation.VERTICAL,
                    false,
                    true,
                    false
            );

            chart.setBackgroundPaint(new Color(251, 248, 243));
            XYPlot plot = chart.getXYPlot();
            plot.setBackgroundPaint(Color.WHITE);
            plot.setDomainGridlinePaint(new Color(232, 226, 216));
            plot.setRangeGridlinePaint(new Color(232, 226, 216));

            XYLineAndShapeRenderer renderer = new XYLineAndShapeRenderer();
            renderer.setSeriesPaint(0, new Color(143, 166, 142));
            renderer.setSeriesStroke(0, new BasicStroke(2.5f));
            plot.setRenderer(renderer);

            BufferedImage bufferedImage = chart.createBufferedImage(500, 240);
            ByteArrayOutputStream chartOut = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(bufferedImage, "png", chartOut);
            Image chartImage = Image.getInstance(chartOut.toByteArray());
            chartImage.setAlignment(Element.ALIGN_CENTER);
            chartImage.setSpacingAfter(20);
            document.add(chartImage);
        }

        // Emotion Distribution
        Map<String, Long> emoCounts = entries.stream()
                .collect(Collectors.groupingBy(MoodEntry::getEmotion, Collectors.counting()));

        Paragraph emoHeader = new Paragraph("Emotion Distribution", headerFont);
        emoHeader.setSpacingAfter(10);
        document.add(emoHeader);

        PdfPTable emoTable = new PdfPTable(2);
        emoTable.setWidthPercentage(100);
        emoTable.setSpacingAfter(25);

        for (Map.Entry<String, Long> entry : emoCounts.entrySet()) {
            PdfPCell cellName = new PdfPCell(new Phrase(capitalize(entry.getKey()), textFont));
            cellName.setBorderColor(new Color(232, 226, 216));
            cellName.setPadding(6);

            PdfPCell cellCount = new PdfPCell(new Phrase(String.format("%d times", entry.getValue()), textFont));
            cellCount.setBorderColor(new Color(232, 226, 216));
            cellCount.setPadding(6);

            emoTable.addCell(cellName);
            emoTable.addCell(cellCount);
        }
        document.add(emoTable);

        // Grounding Footer & Care Disclaimer
        Paragraph disclaimer = new Paragraph(
                "Notice: This wellness summary is intended for personal emotional reflection and private conversation with a therapist. " +
                "MindEase is not a clinical medical device. If you are experiencing distress, reach out to Tele-MANAS (14416) or your healthcare provider.",
                textMuted
        );
        disclaimer.setSpacingBefore(15);
        document.add(disclaimer);

        document.close();
        return out.toByteArray();
    }

    private PdfPCell createStatCell(String title, String value, Font labelFont, Font valFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorderColor(new Color(232, 226, 216));
        cell.setBackgroundColor(new Color(251, 248, 243));
        cell.setPadding(10);

        Paragraph p1 = new Paragraph(title, labelFont);
        Paragraph p2 = new Paragraph(value, valFont);
        cell.addElement(p1);
        cell.addElement(p2);
        return cell;
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) return "";
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
}
