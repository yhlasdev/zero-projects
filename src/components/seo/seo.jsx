import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, name, type, href }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <link rel="canonical" href={href || window.location.href} />

            {/* Facebook / Open Graph */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* For Twitter Meta */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
};

export default Seo;