import math
import struct
import wave
import os

SAMPLE_RATE = 44100

def create_wave_file(filename, samples, sample_rate=SAMPLE_RATE, channels=2):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(channels)
        wav_file.setsampwidth(2) # 16-bit
        wav_file.setframerate(sample_rate)
        
        raw_bytes = bytearray()
        for sample in samples:
            # Clamp to -1.0 to 1.0
            val = max(-1.0, min(1.0, sample))
            int_val = int(val * 32767.0)
            packed = struct.pack('<h', int_val)
            for _ in range(channels):
                raw_bytes.extend(packed)
        wav_file.writeframes(raw_bytes)
    print(f"Generated {filename} ({len(samples)/sample_rate:.2f}s)")

# 1. GENERATE BACKGROUND CYBER TRACK (19.5 seconds)
def generate_soundtrack(duration_sec=19.5):
    total_samples = int(duration_sec * SAMPLE_RATE)
    samples = [0.0] * total_samples
    
    bpm = 124.0
    beat_sec = 60.0 / bpm
    beat_samples = int(beat_sec * SAMPLE_RATE)
    
    # Chord frequencies (Em, C, D, Bm cyber progression)
    chords = [
        [82.4, 164.8, 196.0, 246.9], # Em
        [65.4, 130.8, 164.8, 196.0], # C
        [73.4, 146.8, 185.0, 220.0], # D
        [61.7, 123.5, 146.8, 185.0], # Bm
    ]
    
    for i in range(total_samples):
        t = i / SAMPLE_RATE
        measure = int(t / (beat_sec * 4)) % len(chords)
        chord = chords[measure]
        
        # 1. Pulsing sub-bass (55 Hz + slight octave)
        bass_env = 0.5 + 0.5 * math.sin(2 * math.pi * (t / beat_sec) * 2)
        sub_bass = 0.35 * math.sin(2 * math.pi * 55.0 * t) * bass_env
        
        # 2. Cyber arpeggiator (16th notes)
        step = int(t / (beat_sec / 4)) % 4
        arp_freq = chord[step] * 2.0
        arp_env = math.exp(-6.0 * ((t % (beat_sec / 4)) / (beat_sec / 4)))
        arp = 0.22 * math.sin(2 * math.pi * arp_freq * t) * arp_env
        
        # 3. High pad / atmospheric synth
        pad = 0.08 * sum(math.sin(2 * math.pi * f * 2 * t) for f in chord) / len(chord)
        
        # 4. Rhythmic kick & snare beat
        beat_pos = t % beat_sec
        kick = 0.0
        if beat_pos < 0.15:
            # Pitch drop kick (120Hz down to 40Hz)
            kick_pitch = 40.0 + 80.0 * math.exp(-35.0 * beat_pos)
            kick = 0.45 * math.sin(2 * math.pi * kick_pitch * beat_pos) * math.exp(-18.0 * beat_pos)
        
        # Hi-hat on 8th notes
        hat_pos = t % (beat_sec / 2)
        hihat = 0.0
        if hat_pos < 0.04:
            # White noise burst
            hihat = 0.08 * ((math.sin(i * 1234.56) % 1.0) * 2 - 1) * math.exp(-80.0 * hat_pos)
        
        # Fade in & fade out
        fade_in = min(1.0, t / 0.8)
        fade_out = min(1.0, (duration_sec - t) / 1.2)
        master_env = fade_in * fade_out
        
        samples[i] = (sub_bass + arp + pad + kick + hihat) * master_env * 0.95

    create_wave_file("creative-studio/video/public/audio/bg_cyber_pulse.wav", samples)

# 2. SFX: THREAT ALARM BUZZER
def generate_alarm(duration_sec=1.2):
    total = int(duration_sec * SAMPLE_RATE)
    samples = []
    for i in range(total):
        t = i / SAMPLE_RATE
        freq = 880.0 if int(t * 12) % 2 == 0 else 660.0
        wave_val = math.sin(2 * math.pi * freq * t)
        env = math.exp(-2.2 * t)
        samples.append(wave_val * env * 0.6)
    create_wave_file("creative-studio/video/public/audio/sfx_alarm.wav", samples)

# 3. SFX: HIGH-TECH LASER / SWEEP
def generate_whoosh(duration_sec=0.8):
    total = int(duration_sec * SAMPLE_RATE)
    samples = []
    for i in range(total):
        t = i / SAMPLE_RATE
        freq = 200.0 + 2400.0 * (1.0 - t / duration_sec) ** 2
        wave_val = math.sin(2 * math.pi * freq * t)
        env = math.sin(math.pi * (t / duration_sec))
        samples.append(wave_val * env * 0.45)
    create_wave_file("creative-studio/video/public/audio/sfx_whoosh.wav", samples)

# 4. SFX: CRYPTO APPROVAL CHIME
def generate_chime(duration_sec=1.5):
    total = int(duration_sec * SAMPLE_RATE)
    samples = []
    for i in range(total):
        t = i / SAMPLE_RATE
        # Bright major 9th chime (C6, E6, G6, D7)
        c6 = math.sin(2 * math.pi * 1046.50 * t) * math.exp(-3.0 * t)
        e6 = math.sin(2 * math.pi * 1318.51 * t) * math.exp(-3.5 * t)
        g6 = math.sin(2 * math.pi * 1567.98 * t) * math.exp(-4.0 * t)
        d7 = math.sin(2 * math.pi * 2349.32 * t) * math.exp(-4.5 * t)
        samples.append((c6 * 0.3 + e6 * 0.25 + g6 * 0.2 + d7 * 0.15) * 0.8)
    create_wave_file("creative-studio/video/public/audio/sfx_ping.wav", samples)

# 5. SFX: SUB-BASS IMPACT
def generate_impact(duration_sec=1.8):
    total = int(duration_sec * SAMPLE_RATE)
    samples = []
    for i in range(total):
        t = i / SAMPLE_RATE
        pitch = 140.0 * math.exp(-12.0 * t) + 42.0
        sub = math.sin(2 * math.pi * pitch * t)
        noise = ((math.sin(i * 987.65) % 1.0) * 2 - 1) * math.exp(-30.0 * t) * 0.3
        env = math.exp(-2.5 * t)
        samples.append((sub + noise) * env * 0.7)
    create_wave_file("creative-studio/video/public/audio/sfx_impact.wav", samples)

if __name__ == '__main__':
    print("Synthesizing broadcast audio assets for Remotion...")
    generate_soundtrack()
    generate_alarm()
    generate_whoosh()
    generate_chime()
    generate_impact()
    print("All audio assets synthesized successfully!")

