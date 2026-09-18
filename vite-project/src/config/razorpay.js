// Razorpay Configuration
export const razorpayConfig = {
  // Your actual Razorpay key ID
  key: "rzp_test_S060WMnc2eFoWe",

  currency: "INR",
  name: "Hospital Management System",
  description: "Medical Consultation Payment",
  image: "https://via.placeholder.com/100x100/0f766e/ffffff?text=H", // Replace with your hospital logo
  theme: {
    color: "#0f766e",
  },
};

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 10000);
      return;
    }

    // Load the script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};