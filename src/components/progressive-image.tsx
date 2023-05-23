import { FC, useState } from 'react';

type ProgressiveImageProps = {
    src: string;
    loadingSrc: string;
    alt: string;
};

const ProgressiveImage: FC<ProgressiveImageProps> = ({ alt, loadingSrc, src }) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    return (
        <div className="relative aspect-square">
            {!isLoaded && (
                <img
                    loading="lazy"
                    src={loadingSrc}
                    alt={alt}
                    className="w-full aspect-square blur-md absolute object-cover rounded-sm"
                />
            )}
            <img
                loading="lazy"
                src={src}
                alt={alt}
                className="w-full aspect-square absolute object-cover rounded-sm"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};
export default ProgressiveImage;
