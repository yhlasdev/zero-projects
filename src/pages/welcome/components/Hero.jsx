import { useEffect, useState } from "react";

const slides = [
    {
        title: "Yerinde bilen işiňizi hasaba alyň",
        text: "Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň.",
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700",
    },
];

const Hero = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero">
            <div className="container hero-flex">
                <div className="hero-text">
                    <h1>{slides[index].title}</h1>
                    <p>{slides[index].text}</p>
                    <button className="btn-primary big">Başlamak →</button>
                </div>

                <div className="hero-image">
                    <img src={slides[index].image} alt="hero" />
                </div>
            </div>
        </section>
    );
};

export default Hero;