// pages/api/aiResponse.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,  // استفاده از کلید API از فایل .env.local
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // مدل مورد نظر
          messages: [{
            role: "user",
            content: req.body.query, // ارسال محتوای پرسش کاربر
          }],
        }),
      });

      if (!response.ok) {
        return res.status(500).json({ message: 'خطا در ارتباط با API' });
      }

      const data = await response.json();
      res.status(200).json({ message: data.choices[0].message.content || 'پاسخ یافت نشد' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'مشکلی در پردازش درخواست پیش آمد' });
    }
  } else {
    res.status(405).json({ message: 'روش درخواست مجاز نیست' });
  }
}
