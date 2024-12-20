'use client';

import React, { useState, useEffect, useCallback } from 'react';

const AIComponent: React.FC = () => {
  const [circleSize, setCircleSize] = useState(100);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // تابع برای دریافت پاسخ از ورودی کاربر
  const getResponse = (query: string): string => {
    if (query.toLowerCase().includes('سلام') || query.toLowerCase().includes('هی')) {
      return 'سلام , عشقم چطوری خوبی؟ روزت چطور بود عشقم';
    } else if (query.toLowerCase().includes('چطوری')) {
      return 'روز من خیلی خوب بوده، ممنون که پرسیدی!';
    } else if (query.toLowerCase().includes('ریدم')) {
      return 'نرین عشقم, برین دهن بدخواهات ';
    } else if (query.toLowerCase().includes('خداحافظ')) {
      return 'خداحافظ! روز خوبی داشته باشید!';
    } else {
      return 'ببخشید عشقم متوجه حرفت نشدم میشه دوباره بگی فدات بشم؟';
    }
  };

  // تابع برای تبدیل پاسخ به صدا
  const speakResponse = useCallback(
    (response: string) => {
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = 'fa-IR';
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find((voice) => voice.lang === 'fa-IR') || null;

        utterance.onend = () => {
          setTimeout(() => {
            setIsSpeaking(false);
            startListening(); // فراخوانی دوباره تابع گوش دادن
          }, 100);
        };

        if (!isSpeaking) {
          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
        }
      } else {
        console.error('SpeechSynthesis is not supported in this browser.');
      }
    },
    [isSpeaking, startListening] // اضافه کردن وابستگی صحیح
  );

  // تابع برای شروع گوش دادن به صحبت‌های کاربر
  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition: typeof SpeechRecognition; webkitSpeechRecognition: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;

        if (transcript.toLowerCase().includes('youtube')) {
          window.open('https://www.youtube.com', '_blank');
          return;
        }

        const response = getResponse(transcript);
        speakResponse(response);
        setCircleSize(150);
        setTimeout(() => setCircleSize(100), 1000);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Error occurred in speech recognition: ', event.error);
      };

      recognition.start();
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  }, [speakResponse]);

  useEffect(() => {
    startListening(); // تابع شروع گوش دادن
  }, [startListening]);

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

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = keyframes;
  document.head.appendChild(styleElement);
}

export default AIComponent;
