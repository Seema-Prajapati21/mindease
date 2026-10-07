package com.moodtracker.service;

import com.moodtracker.model.Option;
import com.moodtracker.model.Question;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionBankService {

    private final List<Question> questionBank = new ArrayList<>();

    public QuestionBankService() {
        initFull30QuestionPool();
    }

    public List<Question> getDailyQuestions(String ageGroup, List<String> lastSeenIds) {
        if (ageGroup == null || ageGroup.isBlank()) {
            ageGroup = "young_adult";
        }
        final String targetAge = ageGroup.toLowerCase();
        final List<String> safeLastSeen = (lastSeenIds == null) ? Collections.emptyList() : lastSeenIds;

        List<Question> eligible = questionBank.stream()
                .filter(q -> q.getAgeGroups().contains(targetAge))
                .filter(q -> !safeLastSeen.contains(q.getId()))
                .collect(Collectors.toList());

        List<Question> bodyPool = eligible.stream()
                .filter(q -> "body".equals(q.getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(bodyPool);
        Question qBody = !bodyPool.isEmpty() ? bodyPool.get(0) : getFallback("body");

        List<Question> mindPool = eligible.stream()
                .filter(q -> "mind".equals(q.getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(mindPool);
        Question qMind = !mindPool.isEmpty() ? mindPool.get(0) : getFallback("mind");

        List<Question> otherPool = eligible.stream()
                .filter(q -> List.of("metaphor", "social", "needs", "self").contains(q.getCategory()))
                .collect(Collectors.toList());
        Collections.shuffle(otherPool);
        Question qOther = !otherPool.isEmpty() ? otherPool.get(0) : getFallback("metaphor");

        List<Question> result = new ArrayList<>();
        // Make defensive copies of questions with their options so we don't mutate template questions
        for (Question q : List.of(qBody, qMind, qOther)) {
            List<Option> opts = new ArrayList<>(q.getOptions());
            boolean hasSkip = opts.stream().anyMatch(o -> "skip".equalsIgnoreCase(o.getId()));
            if (!hasSkip) {
                opts.add(new Option("skip", "Skip / Not sure"));
            }
            result.add(new Question(q.getId(), q.getCategory(), q.getQuestion(), q.getAgeGroups(), opts));
        }

        return result;
    }

    private Question getFallback(String category) {
        return questionBank.stream()
                .filter(q -> category.equals(q.getCategory()))
                .findFirst()
                .orElse(questionBank.get(0));
    }

    private void initFull30QuestionPool() {
        List<String> allAges = List.of("child", "teen", "young_adult", "adult", "senior");
        List<String> nonTeens = List.of("young_adult", "adult", "senior");
        List<String> nonSeniors = List.of("teen", "young_adult", "adult");

        // BODY (6)
        addQ("q_body_01", "body", "What’s your energy battery at right now?", allAges,
                "80–100% — fully charged", "50–70% — steady pace", "20–40% — running on low", "Red — about to shut down");
        addQ("q_body_02", "body", "How does your body feel right now?", allAges,
                "Light & energized", "Calm & relaxed", "Tense & restless", "Heavy & sluggish");
        addQ("q_body_03", "body", "How did you sleep last night?", allAges,
                "Deep and refreshing", "Restless / woke up often", "Barely slept at all", "Overslept and still drained");
        addQ("q_body_04", "body", "Where is your physical tension sitting?", allAges,
                "No tension at all", "Knots in shoulders/neck", "Stomach churning or tight", "All-over heavy fatigue");
        addQ("q_body_05", "body", "What does your breathing feel like?", allAges,
                "Slow, deep, and steady", "Shallow in chest", "Fast or breathless", "Noticeably heavy");
        addQ("q_body_06", "body", "How does your body want to move right now?", allAges,
                "Run or dance", "Gentle walk or stretch", "Sit still and rest", "Curl up under covers");

        // MIND (6)
        addQ("q_mind_01", "mind", "What’s the tempo of your thoughts?", allAges,
                "Smooth, quiet, and clear", "Racing at 100 mph", "Looping over the same worry", "Foggy, blank, and slow");
        addQ("q_mind_02", "mind", "How easy is it to focus today?", allAges,
                "Effortless flow", "Scattered & easily distracted", "Zero motivation to start", "Irritated by every noise");
        addQ("q_mind_03", "mind", "What voice is loudest in your mind?", allAges,
                "'I've got this handled'", "'There's way too much to do'", "'Why did that happen?'", "'I just don't care today'");
        addQ("q_mind_04", "mind", "If your mind were a browser, how many tabs are open?", allAges,
                "1 single organized tab", "5–10 manageable tabs", "50 tabs with music playing somewhere", "Browser crashed / spinning wheel");
        addQ("q_mind_05", "mind", "How does decision-making feel today?", allAges,
                "Quick and confident", "Overthinking every small choice", "Too mentally drained to decide", "Indifferent / don't mind");
        addQ("q_mind_06", "mind", "How sensitive is your nervous system today?", allAges,
                "Steady as a rock", "Mildly on edge", "Easily startled or overwhelmed", "Numbed out");

        // METAPHOR (6)
        addQ("q_met_01", "metaphor", "If today were weather, what would it be?", allAges,
                "Clear bright sunshine", "Gentle autumn breeze", "Overcast and foggy", "Passing thunderstorm");
        addQ("q_met_02", "metaphor", "What music fits today best?", allAges,
                "Upbeat energetic dance", "Lo-fi chill nature beats", "Slow acoustic melancholic", "Heavy loud distorted rock");
        addQ("q_met_03", "metaphor", "What color tone matches today?", allAges,
                "Warm golden yellow", "Soft calm pastel blue", "Dull monochromatic grey", "Sharp warning red");
        addQ("q_met_04", "metaphor", "If your day were a room, how does it look?", allAges,
                "Sunny, tidy, and open", "Cozy with curtains closed", "Cluttered with papers everywhere", "Crowded, noisy room");
        addQ("q_met_05", "metaphor", "What texture matches today's feeling?", allAges,
                "Warm fleece blanket", "Smooth polished glass", "Rough scratchy burlap", "Sticky or prickly");
        addQ("q_met_06", "metaphor", "If your energy had a sound, what would it be?", allAges,
                "Melodic bird chirping", "Calm ocean waves", "Humming microwave", "Blaring car alarm");

        // SOCIAL & VARIANTS (4)
        addQ("q_soc_01", "social", "Where is your social battery right now?", allAges,
                "Ready to talk and hang out", "Comfortable with close friends", "Need silence and solitude", "Feeling lonely but hard to reach out");
        addQ("q_soc_02", "social", "How did interactions with people feel today?", allAges,
                "Warm and uplifting", "Neutral and ordinary", "Draining and exhausting", "Frustrating or unfair");
        addQ("q_soc_teen", "social", "How in control of your schoolwork and time do you feel?", List.of("teen"),
                "Completely on top of it", "Managing, but rushed", "Falling behind and stressed", "Totally checked out");
        addQ("q_soc_senior", "social", "How in control of your daily health and routine do you feel?", List.of("senior"),
                "Completely in charge", "Managing, but takes effort", "Falling behind on self-care", "Doing the bare minimum");
        addQ("q_soc_adult", "social", "How in control of your schedule do you feel?", nonSeniors,
                "Completely in the driver's seat", "Managing steady pace", "Pulled in 10 directions", "Falling behind on everything");

        // NEEDS (4)
        addQ("q_need_01", "needs", "What do you need most right now?", allAges,
                "A good laugh or fun", "Deep quiet sleep", "A hug or reassuring talk", "Time alone without responsibilities");
        addQ("q_need_02", "needs", "What would make the biggest difference in the next hour?", allAges,
                "A healthy meal and water", "Finishing one pending task", "Stepping away from screens", "A warm shower and bed");
        addQ("q_need_teen", "needs", "When today gets hard, what do you reach for?", List.of("teen"),
                "Snacks or sweet treats", "Headphones & playlist", "Texting a close friend", "Scrolling alone in room");
        addQ("q_need_adult", "needs", "When today gets hard, what do you reach for?", nonTeens,
                "Coffee / tea break", "Quiet walk outside", "Venting to someone", "Escaping into sleep");

        // SELF (4)
        addQ("q_self_teen", "self", "How do you feel about yourself today?", List.of("teen"),
                "Proud and confident", "Pretty okay with myself", "Hard on myself / self-conscious", "Disconnected / insecure");
        addQ("q_self_adult", "self", "How do you feel about yourself right now?", nonTeens,
                "Grounded and capable", "Accepting and patient", "Critical and disappointed", "Lost or uncertain");
        addQ("q_self_02", "self", "What’s pushing you through today?", allAges,
                "Genuine excitement", "Habit and routine", "Fear of falling behind", "Nothing — just going through motions");
        addQ("q_self_03", "self", "Looking forward to tomorrow, you feel...", allAges,
                "Curious or excited", "Peaceful acceptance", "Apprehensive or nervous", "Indifferent or dread");
    }

    private void addQ(String id, String category, String text, List<String> ages, String... options) {
        List<Option> opts = new ArrayList<>();
        for (int i = 0; i < options.length; i++) {
            opts.add(new Option(id + "_opt" + (i + 1), options[i]));
        }
        questionBank.add(new Question(id, category, text, ages, opts));
    }
}
