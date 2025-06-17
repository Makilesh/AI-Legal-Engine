class TTSService {
  private currentAudio: HTMLAudioElement | null = null;

  public async synthesizeSpeech(text: string, language: string = 'en-US'): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopSpeech();

      const response = await fetch('http://127.0.0.1:5000/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: this.getLanguageCode(language),
        }),
      });

      

      const audioData = await response.blob();
      const audioUrl = URL.createObjectURL(audioData);

      // Create and play the audio
      this.currentAudio = new Audio(audioUrl);
      await this.currentAudio.play();

      // Clean up the URL after the audio is done playing
      this.currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  public stopSpeech(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  private getLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      'English': 'en-US',
      'Tamil': 'ta-IN',
      'Hindi': 'hi-IN',
      'Telugu': 'te-IN',
      'Kannada': 'kn-IN'
    };
    return languageMap[language] || 'en-US';
  }
}

export const ttsService = new TTSService();