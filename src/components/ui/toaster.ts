export function useToaster() {
  function showToast(message: string, duration = 2500) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-[99999] text-center text-sm animate-fade-in';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.remove(); }, 300);
    }, duration);
  }
  return showToast;
}

// Add this to your global CSS (e.g., index.css):
// @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
// .animate-fade-in { animation: fade-in 0.3s; }
