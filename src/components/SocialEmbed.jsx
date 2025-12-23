import React from 'react';
import { TwitterEmbed, InstagramEmbed, YouTubeEmbed } from 'react-social-media-embed';

const SocialEmbed = ({ url }) => {
    if (!url) return null;

    // X (Twitter)
    if (/^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.+/i.test(url)) {
        return (
            <div className="my-4 flex justify-center w-full">
                <TwitterEmbed url={url} />
            </div>
        );
    }

    // Instagram
    if (/^(https?:\/\/)?(www\.)?instagram\.com\/.+/i.test(url)) {
        return (
            <div className="my-4 flex justify-center w-full">
                <InstagramEmbed url={url} />
            </div>
        );
    }

    // YouTube
    if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i.test(url)) {
        return (
            <div className="my-4 w-full aspect-video">
                <YouTubeEmbed url={url} width="100%" height="100%" />
            </div>
        );
    }

    // Fallback for other links (just render the link)
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline break-all"
        >
            {url}
        </a>
    );
};

export default SocialEmbed;
