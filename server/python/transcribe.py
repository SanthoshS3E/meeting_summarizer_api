import sys
import whisper
import warnings
import json
# Inside transcribe.py
# suppress FP16 CPU warning
warnings.filterwarnings("ignore", message="FP16 is not supported on CPU")


audio_file_path = sys.argv[1]
model = whisper.load_model("base")
result = model.transcribe(audio_file_path)

# ✅ Return JSON
print(json.dumps({"text": result["text"]}))
