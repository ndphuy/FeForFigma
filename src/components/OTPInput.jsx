import React, { useRef, useState, useEffect } from 'react';

export const OTPInput = ({ length = 6, value = '', onChange = () => {} }) => {
  const [digits, setDigits] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value) {
      const arr = value.split('').slice(0, length);
      while (arr.length < length) arr.push('');
      setDigits(arr);
    }
  }, [value, length]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val.length > 1) {
      // Pasted content
      const pasted = val.replace(/\D/g, '').split('').slice(0, length);
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (index + i < length) newDigits[index + i] = char;
      });
      setDigits(newDigits);
      onChange(newDigits.join(''));
      const nextIndex = Math.min(index + pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const char = val.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    onChange(newDigits.join(''));

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full max-w-[320px] mx-auto">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border-2 transition-all outline-none bg-slate-50 focus:bg-white ${
            digit
              ? 'border-primary text-primary bg-primary-muted/30 shadow-sm'
              : 'border-slate-200 text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary-light/50'
          }`}
        />
      ))}
    </div>
  );
};
