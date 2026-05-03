"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  image?: string;
  isAudio?: boolean;
}

export default function WhatsAppSimulator() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Namaste! 🙏 I am your Bihar Bazaar AI Agent. Tell me what you want to sell, its price, and how many you have. For example: 'I have 5 Madhubani Paintings for 1500 rupees'.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Extraction State
  const [extractedData, setExtractedData] = useState<{ name: string; price: number; stock: number } | null>(null);
  const [step, setStep] = useState<"awaiting_details" | "awaiting_image" | "done">("awaiting_details");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isListening]);

  const simulateBotTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const processText = (textToProcess: string, isAudio = false) => {
    const userMsg: Message = { id: Date.now().toString(), sender: "user", text: textToProcess, isAudio };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    if (step === "awaiting_details") {
      simulateBotTyping(() => {
        // Very basic prototype "AI" extraction using Regex
        const text = textToProcess.toLowerCase();
        
        // Try to find numbers and assume first is stock, second is price, words in between are the name
        const numbers = text.match(/\d+/g);
        
        let stock = 1;
        let price = 500;
        let name = "Custom Product";

        if (numbers && numbers.length >= 2) {
          stock = parseInt(numbers[0]);
          price = parseInt(numbers[1]);
          // Guess name by taking words between stock and price/for
          const match = text.match(new RegExp(`${stock}(.*?)(for|rupees|at|\\b${price}\\b)`));
          if (match && match[1].trim().length > 1) {
            name = match[1].trim().replace(/paintings|sarees|items|pieces/g, (m) => m.slice(0, -1)); // simple singularize
            name = name.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        } else if (numbers && numbers.length === 1) {
          price = parseInt(numbers[0]);
          name = text.replace(numbers[0].toString(), "").replace(/i have|want to sell|for|rupees|rs/g, "").trim();
          name = name.charAt(0).toUpperCase() + name.slice(1);
        } else {
          name = text.replace(/i have|want to sell|for|rupees|rs/gi, "").trim() || name;
          name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        setExtractedData({ name, price, stock });
        setStep("awaiting_image");

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: `Perfect! I understand you want to sell **${stock} ${name}** for **₹${price}** each. 📸 Please tap the attachment icon (📎) to upload a photo of the product.`,
          },
        ]);
      });
    } else if (step === "awaiting_image") {
      simulateBotTyping(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "Please upload an image by clicking the 📎 icon so I can list your product!" },
        ]);
      });
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    processText(inputText, false);
  };

  const handleStartVoice = () => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      processText(transcript, true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      alert("Could not hear you properly. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || step !== "awaiting_image" || !extractedData) return;

    const previewUrl = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: "Here is the photo.", image: previewUrl }]);

    simulateBotTyping(async () => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text: "Processing your image and creating the listing..." }]);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("files", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const { urls } = await uploadRes.json();
        const imageUrl = urls[0];

        const productPayload = {
          name: extractedData.name,
          price: extractedData.price,
          category: "Handicrafts", 
          stock: extractedData.stock,
          status: "active",
          description: `Automatically listed via WhatsApp AI Agent. This is a beautiful ${extractedData.name}.`,
          image: imageUrl,
          images: JSON.stringify([imageUrl]),
          highlights: JSON.stringify(["Handmade", "Local Artisan Product"]),
          details: JSON.stringify({}),
          vendor: user?.name || "WhatsApp Artisan",
          sellerId: user?.id || "ai-agent-demo",
        };

        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });

        if (!res.ok) throw new Error("Product creation failed");

        setStep("done");
        setMessages((prev) => [
          ...prev,
          { 
            id: Date.now().toString(), 
            sender: "bot", 
            text: `✅ Success! Your product **${extractedData.name}** is now live on Bihar Bazaar! Buyers can now purchase it.` 
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: "bot", text: "❌ Sorry, something went wrong while uploading. Please try again." },
        ]);
      }
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-[#e5ddd5] dark:bg-zinc-950 font-sans">
      <div className="max-w-md w-full mx-auto h-full sm:h-[90vh] sm:my-auto sm:border-[12px] sm:border-black sm:rounded-[3rem] overflow-hidden bg-[#e5ddd5] dark:bg-zinc-900 shadow-2xl relative flex flex-col">
        
        <div className="bg-[#075e54] dark:bg-zinc-800 text-white px-4 py-3 flex items-center gap-3 shadow-md z-10">
          <Link href="/" className="text-white hover:text-white/80">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
          <div className="flex-1">
            <h2 className="font-semibold text-base leading-tight">Bihar Bazaar AI Agent</h2>
            <p className="text-[11px] text-white/80">online</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 custom-scrollbar relative" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: 'cover', backgroundBlendMode: 'multiply' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg p-2.5 shadow-sm text-sm relative ${msg.sender === "user" ? "bg-[#dcf8c6] dark:bg-green-900 text-black dark:text-white rounded-tr-none" : "bg-white dark:bg-zinc-800 text-black dark:text-white rounded-tl-none"}`}>
                
                {msg.isAudio ? (
                  <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-2 rounded-full mb-1 w-48">
                    <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">▶</button>
                    <div className="flex-1 h-1.5 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ) : null}

                {msg.image && (
                  <img src={msg.image} alt="Upload" className="w-full max-w-[200px] h-auto rounded-md mb-2 object-cover" />
                )}

                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                
                <span className="text-[10px] text-black/40 dark:text-white/40 block text-right mt-1.5 float-right ml-4">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender === "user" && <span className="text-blue-500 ml-1">✓✓</span>}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-zinc-800 rounded-lg rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          {isListening && (
            <div className="flex justify-end">
              <div className="bg-[#dcf8c6] dark:bg-green-900 rounded-lg p-2 shadow-sm text-sm flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                <span className="animate-pulse">🎙️ Listening... Speak now</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-[#f0f0f0] dark:bg-zinc-900 p-2 flex items-end gap-2">
          <div className="flex-1 bg-white dark:bg-zinc-800 rounded-full flex items-end px-2 py-1 shadow-sm">
            <button className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white">😀</button>
            <input
              type="text"
              placeholder="Message"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              className="flex-1 bg-transparent py-2.5 px-2 outline-none text-sm dark:text-white"
            />
            
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white" title="Attach Image">
              📎
            </button>
            
          </div>
          
          {inputText.trim() ? (
            <button onClick={handleSendText} className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-transform active:scale-95">
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          ) : (
            <button 
              onClick={handleStartVoice} 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-all active:scale-95 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-[#00a884]'}`}
              title="Speak"
            >
              🎤
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
