package com.mindease.controller;

import com.mindease.service.PdfSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/journey")
@Tag(name = "Journey & Reports", description = "Endpoints for downloading wellness summaries and reports.")
public class JourneyController {

    private final PdfSummaryService pdfSummaryService;

    public JourneyController(PdfSummaryService pdfSummaryService) {
        this.pdfSummaryService = pdfSummaryService;
    }

    @GetMapping("/summary/pdf")
    @Operation(summary = "Download wellness summary PDF report", description = "Generates a PDF document with OpenPDF and JFreeChart trajectory.")
    public ResponseEntity<byte[]> downloadPdfSummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        try {
            String fromDate = (from != null && !from.trim().isEmpty()) ? from : LocalDate.now().minusDays(30).toString();
            String toDate = (to != null && !to.trim().isEmpty()) ? to : LocalDate.now().toString();

            byte[] pdfBytes = pdfSummaryService.generateWellnessPdf(userDetails.getUsername(), fromDate, toDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "MindEase_Wellness_Summary_" + toDate + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
