document.addEventListener('scroll', () => {
    const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    // Define your gradient color stops
    const color1 = [167, 139, 250]; // #a78bfa
    const color2 = [240, 171, 252]; // #f0abfc
    const color3 = [252, 215, 93];  // #fcd75d
    const color4 = [242, 139, 129]; // #f28b81

    // Function to interpolate between two colors
    const interpolateColor = (colorA, colorB, factor) => {
        const result = colorA.map((start, index) => Math.round(start + factor * (colorB[index] - start)));
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    };

    let backgroundColor;

    if (scrollPercentage < 0.33) {
        backgroundColor = `linear-gradient(to bottom, ${interpolateColor(color1, color2, scrollPercentage / 0.33)} 0%, ${color2} 100%)`;
    } else if (scrollPercentage < 0.66) {
        const adjustedScroll = (scrollPercentage - 0.33) / 0.33;
        backgroundColor = `linear-gradient(to bottom, ${interpolateColor(color2, color3, adjustedScroll)} 0%, ${color3} 100%)`;
    } else {
        const adjustedScroll = (scrollPercentage - 0.66) / 0.34;
        backgroundColor = `linear-gradient(to bottom, ${interpolateColor(color3, color4, adjustedScroll)} 0%, ${color4} 100%)`;
    }

    document.body.style.background = backgroundColor;
});

const text = "WELCOME"; // The text you want to display
const typingTextElement = document.getElementById('typing-text');
let charIndex = 0;
const typingSpeed = 150; // Adjust for the speed of appearance (milliseconds)

function typeWriter() {
  if (charIndex < text.length) {
    typingTextElement.textContent += text.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, typingSpeed);
  }
}

// Ensure the typing animation starts after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Optional: Add a delay before the text starts appearing
  setTimeout(typeWriter, 500); // Wait 500 milliseconds before starting
});