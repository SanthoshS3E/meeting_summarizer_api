import sys
import json
from transformers import pipeline

def main():
    try:
        # ✅ Read transcript from stdin
        raw_input = sys.stdin.read()
        payload = json.loads(raw_input)
        transcript = payload.get("transcript", "")

        if not transcript.strip():
            print(json.dumps({"error": "No transcript provided"}))
            return

        # ✅ Load summarizer (BART)
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

        # ✅ Handle long transcripts by chunking
        if len(transcript) > 2000:
            chunks = [transcript[i:i+2000] for i in range(0, len(transcript), 2000)]
            summaries = [summarizer(chunk, max_length=100, min_length=30, do_sample=False)[0]['summary_text'] for chunk in chunks]
            merged_summary = " ".join(summaries)
            final_summary = summarizer(merged_summary, max_length=120, min_length=50, do_sample=False)[0]['summary_text']
        else:
            final_summary = summarizer(transcript, max_length=100, min_length=30, do_sample=False)[0]['summary_text']

        # ✅ Print ONLY JSON, no extra logs
        print(json.dumps({"summary": final_summary}))

    except Exception as e:
        # ✅ Print JSON error if something fails
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
