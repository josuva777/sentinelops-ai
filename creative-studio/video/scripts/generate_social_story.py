import asyncio
import edge_tts
import json
import math
import os
import struct
import wave

SAMPLE_RATE = 44100

def create_wave_file(filename, samples, sample_rate=SAMPLE_RATE, channels=2):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        raw_bytes = bytearray()
        for sample in samples:
            val = max(-1.0, min(1.0, sample))
            int_val = int(val * 32767.0)
            packed = struct.pack('<h', int_val)
            for _ in range(channels):
                raw_bytes.extend(packed)
        wav_file.writeframes(raw_bytes)
    print(f"[+] Generated Audio: {filename} ({len(samples)/sample_rate:.2f}s)")

# 1. Rhythmic Tension Drone & Synth Pulse for Viral Reel
def generate_reel_soundtrack(duration_sec=22.0, output_path="public/audio/bg_reel_tension.wav"):
    total_samples = int(duration_sec * SAMPLE_RATE)
    samples = [0.0] * total_samples
    bpm = 128.0
    beat_sec = 60.0 / bpm
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        
        # 1. Sub drone (48 Hz sub bass)
        sub = 0.28 * math.sin(2 * math.pi * 48.0 * t)
        
        # 2. Pulsing cyber synth 16th notes
        step_pos = (t % (beat_sec / 4)) / (beat_sec / 4)
        synth_env = math.exp(-8.0 * step_pos)
        synth_freq = 110.0 if (int(t / (beat_sec * 2)) % 2 == 0) else 130.8
        synth = 0.18 * math.sin(2 * math.pi * synth_freq * t) * synth_env
        
        # 3. Heartbeat kick every beat
        beat_pos = (t % beat_sec)
        kick = 0.0
        if beat_pos < 0.12:
            kick_pitch = 45.0 + 90.0 * math.exp(-40.0 * beat_pos)
            kick = 0.5 * math.sin(2 * math.pi * kick_pitch * beat_pos) * math.exp(-22.0 * beat_pos)
            
        # 4. Hi-hat ticks
        hat = 0.0
        if (t % (beat_sec / 2)) < 0.03:
            hat = 0.06 * ((math.sin(i * 999.12) % 1.0) * 2 - 1)
            
        fade_in = min(1.0, t / 0.5)
        fade_out = min(1.0, (duration_sec - t) / 1.0)
        samples[i] = (sub + synth + kick + hat) * fade_in * fade_out * 0.9

    create_wave_file(output_path, samples)

# 2. Heartbeat SFX
def generate_heartbeat(output_path="public/audio/sfx_heartbeat.wav"):
    duration = 1.0
    total = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(total):
        t = i / SAMPLE_RATE
        val = 0.0
        # Two thumps: at t=0 and t=0.25
        if t < 0.15:
            val += 0.7 * math.sin(2 * math.pi * 45.0 * t) * math.exp(-25.0 * t)
        elif 0.25 <= t < 0.4:
            t2 = t - 0.25
            val += 0.5 * math.sin(2 * math.pi * 45.0 * t2) * math.exp(-25.0 * t2)
        samples.append(val)
    create_wave_file(output_path, samples)

# 3. Neural Voice & Caption Generation
async def build_audio_assets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    audio_dir = os.path.join(base_dir, "public", "audio")
    os.makedirs(audio_dir, exist_ok=True)
    
    # SFX & Soundtracks
    generate_reel_soundtrack(22.0, os.path.join(audio_dir, "bg_reel_tension.wav"))
    generate_heartbeat(os.path.join(audio_dir, "sfx_heartbeat.wav"))
    
    # 1. VIRAL REEL VOICE (Fast, narrative, high-stakes tech storytelling)
    reel_script = (
        "An autonomous AI agent just tried to wire $84,000 offshore. "
        "In 8 milliseconds, SentinelOps intercepted the payload pre-flight. "
        "Deterministic mathematical rules. Zero LLM hallucinations. "
        "The rogue loop was paused with a 15-minute cryptographic token. "
        "Only executive human approval unlocks execution. "
        "SentinelOps AI. Stop rogue agents before they act."
    )
    
    comm_reel = edge_tts.Communicate(reel_script, 'en-US-ChristopherNeural', rate='+8%', pitch='-2Hz')
    reel_sentences = []
    reel_audio_bytes = bytearray()
    
    async for chunk in comm_reel.stream():
        if chunk.get('type') == 'audio':
            reel_audio_bytes.extend(chunk['data'])
        elif chunk.get('type') == 'SentenceBoundary':
            start_s = chunk['offset'] / 10000000.0
            dur_s = chunk['duration'] / 10000000.0
            text = chunk['text']
            
            # Sub-split into words with proportional timing
            words = text.split()
            word_count = max(1, len(words))
            time_per_word = dur_s / word_count
            
            word_list = []
            for idx, w in enumerate(words):
                w_start = start_s + idx * time_per_word
                w_end = w_start + time_per_word
                word_list.append({
                    "word": w,
                    "start": round(w_start, 3),
                    "end": round(w_end, 3)
                })
                
            reel_sentences.append({
                "sentence": text,
                "start": round(start_s, 3),
                "end": round(start_s + dur_s, 3),
                "words": word_list
            })
            
    with open(os.path.join(audio_dir, "voice_reel.mp3"), "wb") as f:
        f.write(reel_audio_bytes)
        
    with open(os.path.join(audio_dir, "reel_captions.json"), "w", encoding="utf-8") as f:
        json.dump(reel_sentences, f, indent=2)
        
    reel_end = reel_sentences[-1]["end"] if reel_sentences else 18.0
    print(f"[+] Reel Voice: {reel_end}s ({len(reel_sentences)} sentences)")

    # 2. CINEMATIC COMMERCIAL VOICE (Widescreen 16:9, deep authoritative voice)
    comm_script = (
        "Autonomous AI agents are executing real actions in production. "
        "Moving capital. Altering databases. Accessing private infrastructure. "
        "When an agent goes rogue, post-execution logs are too late. "
        "SentinelOps AI delivers deterministic in-line guardrails. "
        "Mathematical policy enforcement. Zero LLM hallucinations. "
        "Cryptographic human authorization for high-risk actions. "
        "SentinelOps AI. Guardrails that actually enforce."
    )
    
    comm_spot = edge_tts.Communicate(comm_script, 'en-US-GuyNeural', rate='+2%', pitch='-3Hz')
    spot_sentences = []
    spot_audio_bytes = bytearray()
    
    async for chunk in comm_spot.stream():
        if chunk.get('type') == 'audio':
            spot_audio_bytes.extend(chunk['data'])
        elif chunk.get('type') == 'SentenceBoundary':
            start_s = chunk['offset'] / 10000000.0
            dur_s = chunk['duration'] / 10000000.0
            text = chunk['text']
            words = text.split()
            word_count = max(1, len(words))
            time_per_word = dur_s / word_count
            word_list = []
            for idx, w in enumerate(words):
                w_start = start_s + idx * time_per_word
                w_end = w_start + time_per_word
                word_list.append({
                    "word": w,
                    "start": round(w_start, 3),
                    "end": round(w_end, 3)
                })
            spot_sentences.append({
                "sentence": text,
                "start": round(start_s, 3),
                "end": round(start_s + dur_s, 3),
                "words": word_list
            })
            
    with open(os.path.join(audio_dir, "voice_commercial.mp3"), "wb") as f:
        f.write(spot_audio_bytes)
        
    with open(os.path.join(audio_dir, "commercial_captions.json"), "w", encoding="utf-8") as f:
        json.dump(spot_sentences, f, indent=2)
        
    spot_end = spot_sentences[-1]["end"] if spot_sentences else 20.0
    print(f"[+] Commercial Voice: {spot_end}s ({len(spot_sentences)} sentences)")
    
    # Save video metadata manifest
    metadata = {
        "reel": {
            "duration_sec": reel_end + 2.0,
            "fps": 60,
            "frames": int((reel_end + 2.0) * 60),
            "width": 1080,
            "height": 1920,
            "aspect": "9:16",
            "format": "Instagram Reels / TikTok / YouTube Shorts"
        },
        "commercial": {
            "duration_sec": spot_end + 2.5,
            "fps": 60,
            "frames": int((spot_end + 2.5) * 60),
            "width": 1920,
            "height": 1080,
            "aspect": "16:9",
            "format": "YouTube Landscape / Website Hero / Product Hunt"
        }
    }
    with open(os.path.join(base_dir, "video_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print("[SUCCESS] All social audio, neural voiceovers, captions, and metadata successfully generated!")

if __name__ == "__main__":
    asyncio.run(build_audio_assets())

