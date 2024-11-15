'use client';

import React, { useState, useEffect } from 'react';

const AIComponent: React.FC = () => {
  const [circleSize, setCircleSize] = useState(100);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = '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';  // API key از OpenAI

  // درخواست به OpenAI برای دریافت پاسخ
  const getOpenAIResponse = async (query: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',  // مدل OpenAI
          prompt: query,
          max_tokens: 150,
        }),
      });
      
      if (response.status === 402) {  // اگر محدودیت اعتبار وجود داشت
        return 'اعتبار شما ناکافی است. لطفاً حساب خود را شارژ کنید.';
      }

      const data = await response.json();
      if (data.error) {
        return `خطا: ${data.error.message}`;
      }

      return data.choices[0]?.text?.trim() || 'ببخشید، نتونستم پاسخی پیدا کنم.';
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      return 'ببخشید، مشکلی پیش اومد!';
    }
  };

  const speakResponse = (response: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'fa-IR'; 
      utterance.voice = window.speechSynthesis.getVoices().find((voice: any) => voice.lang === 'fa-IR') || null;

      utterance.onend = () => {
        setTimeout(() => {
          setIsSpeaking(false);
          startListening(); 
        }, 100);
      };

      if (!isSpeaking) {
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);

        // درخواست از OpenAI
        const response = await getOpenAIResponse(transcript);
        setAiResponse(response);
        speakResponse(response);
        setCircleSize(150);
        setTimeout(() => setCircleSize(100), 1000);
      };

      recognition.onerror = (event: any) => {
        console.error("Error occurred in speech recognition: ", event.error);
      };

      recognition.start();
    } else {
      console.error("SpeechRecognition is not supported in this browser.");
    }
  };

  useEffect(() => {
    startListening(); 
  }, []);

  return (
    <div style={styles.body}>
      <div style={{ ...styles.circle, width: circleSize, height: circleSize }}></div>
      <div style={{ ...styles.circle, width: circleSize, height: circleSize }}></div>
      <div style={{ ...styles.circle, width: circleSize, height: circleSize }}></div>
      <div style={{ ...styles.circle, width: circleSize, height: circleSize }}></div>
    </div>
  );
};

const styles = {
  body: {
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    flexDirection: 'row',
    position: 'relative',
  },
  circle: {
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'inline-block',
    margin: '10px',
    transition: 'width 0.3s, height 0.3s, transform 0.5s ease-in-out',
    animation: 'pulse 1s infinite',
  },
};

const keyframes = `
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}`;

const styleElement = document.createElement('style');
styleElement.innerHTML = keyframes;
document.head.appendChild(styleElement);

export default AIComponent;
