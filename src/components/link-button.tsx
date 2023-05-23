import clsx from 'clsx';
import { FC, HTMLProps } from 'react';

type Props = HTMLProps<HTMLAnchorElement>;

const LinkButton: FC<Props> = ({ children, className, ...rest }) => (
    <a
        {...rest}
        className={clsx(
            'disabled:bg-gray-600 rounded-md p-2 text-center inline-block w-full',
            className
        )}
    >
        {children}
    </a>
);

export default LinkButton;
