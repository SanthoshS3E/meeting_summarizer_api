import sys
import re
import json

def extract_action_items(text):
    # Lowercase and clean up
    lines = text.split(". ")
    action_items = []

    # Simple rule-based patterns
    patterns = [
        r"\bwe need to\b",
        r"\blet's\b",
        r"\bthe next step\b",
        r"\bwe should\b",
        r"\baction item\b",
        r"\bto do\b",
        r"\bmake sure\b"
    ]

    for line in lines:
        for pattern in patterns:
            if re.search(pattern, line, re.IGNORECASE):
                action_items.append(line.strip())
                break

    return action_items

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_actions.py <transcript_text>")
        sys.exit(1)

    transcript_path = sys.argv[1]

    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript_text = f.read()

    items = extract_action_items(transcript_text)

    result = {
        "action_items": items or ["No action items found."]
    }

    print(json.dumps(result, indent=4))
