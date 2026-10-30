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
        initQuestionPool();
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

        List<Question> result = new ArrayList<>();
        result.add(pickFrom(eligible, "body"));
        result.add(pickFrom(eligible, "mind"));

        List<String> secondary = new ArrayList<>(List.of(
                "metaphor", "social", "needs", "self", "sensory", "coping", "outlook"
        ));
        Collections.shuffle(secondary);
        for (int i = 0; i < 4 && i < secondary.size(); i++) {
            result.add(pickFrom(eligible, secondary.get(i)));
        }

        List<Question> finalResult = new ArrayList<>();
        for (Question q : result) {
            List<Option> opts = new ArrayList<>(q.getOptions());
            boolean hasSkip = opts.stream().anyMatch(o -> "skip".equalsIgnoreCase(o.getId()));
            if (!hasSkip) {
                opts.add(new Option("skip", "Skip / Not sure"));
            }
            finalResult.add(new Question(q.getId(), q.getCategory(), q.getQuestion(), q.getAgeGroups(), opts));
        }
        return finalResult;
    }

    private Question pickFrom(List<Question> eligible, String category) {
        List<Question> pool = eligible.stream()
                .filter(q -> category.equals(q.getCategory()))
                .collect(Collectors.toList());
        if (pool.isEmpty()) {
            return questionBank.stream()
                    .filter(q -> category.equals(q.getCategory()))
                    .findFirst()
                    .orElse(questionBank.get(0));
        }
        Collections.shuffle(pool);
        return pool.get(0);
    }

    private void initQuestionPool() {
        List<String> allAges = List.of("child", "teen", "young_adult", "adult", "senior");
        List<String> nonTeens = List.of("young_adult", "adult", "senior");
        List<String> nonSeniors = List.of("teen", "young_adult", "adult");

        // BODY (8)
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
        addQ("q_body_07", "body", "How has your appetite been today?", allAges,
                "Normal and steady", "Craving comfort food or sugar", "No appetite / forgot to eat", "Eating more than usual to cope");
        addQ("q_body_08", "body", "How is your physical comfort right now?", allAges,
                "Cozy and at ease", "Slightly off but okay", "Uncomfortable and restless", "In pain or very uncomfortable");

        // MIND (8)
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
        addQ("q_mind_07", "mind", "Did anything specific set the tone for today?", allAges,
                "A good moment lifted me", "Nothing in particular — a normal day", "Small things piled up", "Something happened that still feels heavy");
        addQ("q_mind_08", "mind", "How clear is your head right now?", allAges,
                "Crystal clear", "Mostly clear, some noise", "Foggy", "Completely clouded");

        // METAPHOR (8)
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
        addQ("q_met_07", "metaphor", "If your mood had a temperature, what would it be?", allAges,
                "Warm and comfortable", "Cool and steady", "Chilly and numb", "Hot and ready to boil");
        addQ("q_met_08", "metaphor", "If today were a season, what would it be?", allAges,
                "Bright summer", "Gentle spring", "Cozy autumn", "Cold, gray winter");

        // SOCIAL (7)
        addQ("q_soc_01", "social", "Where is your social battery right now?", allAges,
                "Ready to talk and hang out", "Comfortable with close friends", "Need silence and solitude", "Feeling lonely but hard to reach out");
        addQ("q_soc_02", "social", "How did interactions with people feel today?", allAges,
                "Warm and uplifting", "Neutral and ordinary", "Draining and exhausting", "Frustrating or unfair");
        addQ("q_soc_03", "social", "How do you feel about the people in your life right now?", allAges,
                "Grateful for them", "Neutral — no strong feelings", "Let down or frustrated", "Wanting to be left alone");
        addQ("q_soc_04", "social", "How connected do you feel to the people around you?", allAges,
                "Deeply connected", "Somewhat connected", "Distant but okay", "Isolated");
        addQ("q_soc_teen", "social", "How in control of your schoolwork and time do you feel?", List.of("teen"),
                "Completely on top of it", "Managing, but rushed", "Falling behind and stressed", "Totally checked out");
        addQ("q_soc_senior", "social", "How in control of your daily health and routine do you feel?", List.of("senior"),
                "Completely in charge", "Managing, but takes effort", "Falling behind on self-care", "Doing the bare minimum");
        addQ("q_soc_adult", "social", "How in control of your schedule do you feel?", nonSeniors,
                "Completely in the driver's seat", "Managing steady pace", "Pulled in 10 directions", "Falling behind on everything");

        // NEEDS (7)
        addQ("q_need_01", "needs", "What do you need most right now?", allAges,
                "A good laugh or fun", "Deep quiet sleep", "A hug or reassuring talk", "Time alone without responsibilities");
        addQ("q_need_02", "needs", "What would make the biggest difference in the next hour?", allAges,
                "A healthy meal and water", "Finishing one pending task", "Stepping away from screens", "A warm shower and bed");
        addQ("q_need_03", "needs", "What would help most in this moment?", allAges,
                "Someone to talk to", "Time to myself", "To move my body", "To rest and do nothing");
        addQ("q_need_04", "needs", "How well are your basic needs met right now?", allAges,
                "Fully met — fed, hydrated, rested", "Mostly met", "Missing some — haven't eaten or rested", "Ignoring them completely");
        addQ("q_need_05", "needs", "What's the biggest thing weighing on you?", allAges,
                "Something specific I can name", "A general low mood", "Nothing big — just tired", "I can't name it");
        addQ("q_need_teen", "needs", "When today gets hard, what do you reach for?", List.of("teen"),
                "Snacks or sweet treats", "Headphones & playlist", "Texting a close friend", "Scrolling alone in room");
        addQ("q_need_adult", "needs", "When today gets hard, what do you reach for?", nonTeens,
                "Coffee / tea break", "Quiet walk outside", "Venting to someone", "Escaping into sleep");

        // SELF (7)
        addQ("q_self_02", "self", "What’s pushing you through today?", allAges,
                "Genuine excitement", "Habit and routine", "Fear of falling behind", "Nothing — just going through motions");
        addQ("q_self_03", "self", "Looking forward to tomorrow, you feel...", allAges,
                "Curious or excited", "Peaceful acceptance", "Apprehensive or nervous", "Indifferent or dread");
        addQ("q_self_04", "self", "How kind are you being to yourself today?", allAges,
                "Very kind and patient", "Fair — I'm trying", "Harsh and critical", "I don't have energy to care");
        addQ("q_self_05", "self", "How do you feel about who you are today?", allAges,
                "Proud of myself", "Accepting of myself", "Critical of myself", "Confused about myself");
        addQ("q_self_06", "self", "What do you need to forgive yourself for today?", allAges,
                "Nothing — I'm at peace", "A small thing", "A big thing", "I don't know");
        addQ("q_self_teen", "self", "How do you feel about yourself today?", List.of("teen"),
                "Proud and confident", "Pretty okay with myself", "Hard on myself / self-conscious", "Disconnected / insecure");
        addQ("q_self_adult", "self", "How do you feel about yourself right now?", nonTeens,
                "Grounded and capable", "Accepting and patient", "Critical and disappointed", "Lost or uncertain");

        // SENSORY (6) — NEW
        addQ("q_sen_01", "sensory", "How do sounds around you feel right now?", allAges,
                "Pleasant or easy to ignore", "Too loud or grating", "Chaotic and unavoidable", "Muffled, far away");
        addQ("q_sen_02", "sensory", "How does light feel today?", allAges,
                "Warm and comfortable", "Too bright or harsh", "Too dim or heavy", "Flickering or overwhelming");
        addQ("q_sen_03", "sensory", "How does touch feel to you right now?", allAges,
                "Comforting", "Too much — want space", "Numb — can't feel much", "Craving warmth or contact");
        addQ("q_sen_04", "sensory", "What does your physical environment feel like?", allAges,
                "Safe and calm", "Cluttered or chaotic", "Too empty or silent", "Overwhelming and loud");
        addQ("q_sen_05", "sensory", "How does your nervous system feel today?", allAges,
                "Regulated and steady", "Mildly on edge", "Easily startled or jumpy", "Numb or shut down");
        addQ("q_sen_06", "sensory", "What does your body want most from your space?", allAges,
                "Open air and light", "A weighted blanket or cocoon", "Silence and darkness", "Loud music and movement");

        // COPING (6) — NEW
        addQ("q_cop_01", "coping", "What do you reach for when today gets hard?", allAges,
                "Music or movement", "Screens or scrolling", "Food or drink", "Withdrawing from everyone");
        addQ("q_cop_02", "coping", "What has helped you recently?", allAges,
                "Exercise or movement", "Talking to someone", "Rest and quiet", "Distraction or entertainment");
        addQ("q_cop_03", "coping", "Where is your energy going right now?", allAges,
                "Something meaningful", "Just getting by", "Avoiding things", "Pure survival mode");
        addQ("q_cop_04", "coping", "How are you handling your feelings today?", allAges,
                "Facing them directly", "Distracting myself", "Numbing out", "Not sure");
        addQ("q_cop_05", "coping", "What do you most need to hear right now?", allAges,
                "\"You're doing okay\"", "\"Take a break\"", "\"You're not alone\"", "\"This will pass\"");
        addQ("q_cop_06", "coping", "If you could pause the world for one hour, what would you do?", allAges,
                "Sleep", "Move my body", "Create or make something", "Talk to someone I love");

        // OUTLOOK (6) — NEW
        addQ("q_out_01", "outlook", "How hopeful do you feel right now?", allAges,
                "Very hopeful", "Cautiously hopeful", "Not very hopeful", "Hopeless");
        addQ("q_out_02", "outlook", "What's one thing you're grateful for today?", allAges,
                "People in my life", "Something small I did", "A moment of peace", "Having a hard time finding one");
        addQ("q_out_03", "outlook", "How connected do you feel to your future self?", allAges,
                "Strongly connected", "Vaguely aware of them", "Not really connected", "Never thought about it");
        addQ("q_out_04", "outlook", "What feels meaningful today?", allAges,
                "Connection with others", "Work or purpose", "Rest and recovery", "Not sure");
        addQ("q_out_05", "outlook", "What do you want tomorrow to feel like?", allAges,
                "Lighter", "Steady", "Productive", "Same as today");
        addQ("q_out_06", "outlook", "If today had a lesson for you, what would it be?", allAges,
                "Something to appreciate", "Something to change", "Something to accept", "No lesson — just a day");
    }

    private void addQ(String id, String category, String text, List<String> ages, String... options) {
        List<Option> opts = new ArrayList<>();
        for (int i = 0; i < options.length; i++) {
            opts.add(new Option(id + "_opt" + (i + 1), options[i]));
        }
        questionBank.add(new Question(id, category, text, ages, opts));
    }
}
