import { useEffect, useState } from "react";
import { useLocale } from "../../../hooks/useLocale";

const slides = [

    {
        title: "Yerinde bilen işiňizi hasaba alyň",
        text: "Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň.",
        image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700",
    },
];

const Hero = () => {
    const { t } = useLocale();
    const [index, setIndex] = useState(0);

    const slidesTranslated = [
        {
            title: t('welcome.heroTitle', { defaultValue: "Yerinde bilen işiňizi hasaba alyň" }),
            text: t('welcome.heroSubtitle', { defaultValue: "Häzirki zaman çözgütler bilen işiňizi aňsatlykda dolandyryň." }),
            image:
                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700",
        },
    ];


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
                    <h1>{slidesTranslated[index].title}</h1>
                    <p>{slidesTranslated[index].text}</p>
                    <button className="btn-primary big">{t('welcome.getStarted')}</button>
                </div>

                <div className="hero-image">
                    <img src={slidesTranslated[index].image} alt="hero" />
                </div>
            </div>
        </section>

    );
};

export default Hero;