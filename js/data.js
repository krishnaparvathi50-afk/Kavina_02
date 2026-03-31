// Beginner-friendly product "database" (frontend-only)
// Images are local SVGs in /assets to keep the project self-contained.
window.PRODUCTS = [
  {
    id: "aqua-steel-750",
    name: "AquaSteel Premium Bottle",
    price: 24.99,
    size: "750ml",
    type: "Stainless Steel",
    rating: 4.8,
    reviews: 1240,
    badge: "Best Seller",
    image: "assets/bottle-steel.png",
    colors: ["#ffffff", "#22c3ff", "#0f172a"],
    features: ["BPA-free", "Keep cold 24h", "Leak-proof", "Sweat-free"]
  },
  {
    id: "glacier-glass-500",
    name: "Glacier Crystal Glass",
    price: 19.5,
    size: "500ml",
    type: "Glass",
    rating: 4.6,
    reviews: 856,
    badge: "Amazon's Choice",
    image: "assets/bottle-glass.png",
    colors: ["#ffffff", "#7dffbd", "#ff7dbd"],
    features: ["Pure taste", "Silicone sleeve", "Dishwasher safe", "Eco-friendly"]
  },
  {
    id: "mint-sport-1l",
    name: "MintSport Performance",
    price: 17.99,
    size: "1L",
    type: "Plastic",
    rating: 4.4,
    reviews: 2105,
    image: "assets/bottle-mint.png",
    colors: ["#7dffbd", "#22c3ff", "#f59e0b"],
    features: ["Lightweight", "Flip-top", "Measurement marks", "Impact resistant"]
  },
  {
    id: "arctic-insulated-750",
    name: "Arctic Pro Insulated",
    price: 32.99,
    size: "750ml",
    type: "Insulated",
    rating: 4.9,
    reviews: 542,
    badge: "Premium Pick",
    image: "assets/bottle-insulated.png",
    colors: ["#0f172a", "#f6fbff", "#ef4444"],
    features: ["24h Cold / 12h Hot", "Handle lid", "Double wall", "Matte finish"]
  },
  {
    id: "sky-kids-500",
    name: "SkyKids Friendly Bottle",
    price: 14.99,
    size: "500ml",
    type: "Plastic",
    rating: 4.5,
    reviews: 320,
    image: "assets/bottle-kids.png",
    colors: ["#22c3ff", "#ff7dbd", "#f59e0b"],
    features: ["Spill-proof straw", "Easy carry", "BPA-free", "Fun patterns"]
  },
  {
    id: "trail-pro-1l",
    name: "TrailPro Rugged Bottle",
    price: 26.0,
    size: "1L",
    type: "Stainless Steel",
    rating: 4.7,
    reviews: 1102,
    image: "assets/bottle-trail.png",
    colors: ["#475569", "#0f172a", "#15803d"],
    features: ["Rugged build", "Grip texture", "Carabiner ready", "Wide mouth"]
  },
  // New variants to expand variety
  {
    id: "aqua-steel-500",
    name: "AquaSteel Compact",
    price: 19.99,
    size: "500ml",
    type: "Stainless Steel",
    rating: 4.7,
    reviews: 430,
    image: "assets/bottle-steel.png",
    colors: ["#ffffff", "#22c3ff", "#ef4444"],
    features: ["BPA-free", "Fits cup holders", "Leak-proof", "Lightweight"]
  },
  {
    id: "glacier-glass-1l",
    name: "Glacier XL Glass",
    price: 24.5,
    size: "1L",
    type: "Glass",
    rating: 4.5,
    reviews: 215,
    image: "assets/bottle-glass.png",
    colors: ["#ffffff", "#475569", "#22c3ff"],
    features: ["High capacity", "Pure taste", "Silicone base", "Heavy duty"]
  },
  {
    id: "mint-sport-750",
    name: "MintSport Essential",
    price: 15.99,
    size: "750ml",
    type: "Plastic",
    rating: 4.3,
    reviews: 980,
    image: "assets/bottle-mint.png",
    colors: ["#7dffbd", "#ffffff", "#0f172a"],
    features: ["One-hand operation", "BPA-free", "Fast flow", "Secure lock"]
  },
  {
    id: "arctic-lite-500",
    name: "Arctic Lite Insulated",
    price: 21.99,
    size: "500ml",
    type: "Insulated",
    rating: 4.8,
    reviews: 180,
    image: "assets/bottle-insulated.png",
    colors: ["#ffffff", "#22c3ff", "#7dffbd"],
    features: ["Slim design", "Keep cold 12h", "Leak-proof", "Great for kids"]
  }
];

window.REVIEWS = [
  { name: "John D.", rating: 5, date: "2024-03-15", comment: "The best water bottle I have ever owned. Kept my ice frozen for over 24 hours in the sun!", verified: true },
  { name: "Sarah K.", rating: 4, date: "2024-03-10", comment: "Love the design and the colors. The glass feels premium. Just wish the sleeve was a bit thicker.", verified: true },
  { name: "Mike R.", rating: 5, date: "2024-03-05", comment: "Perfect for the gym. Lightweight and easy to flip open while running.", verified: true },
  { name: "Emily W.", rating: 3, date: "2024-02-28", comment: "Good bottle but it doesn't fit my car's cup holder. Check the dimensions before buying.", verified: false }
];
