import clsx from 'clsx';
import { FC, HTMLProps } from 'react';
import { Button as Btn } from '~/components/ui/button';

type Props = HTMLProps<HTMLButtonElement>;

const Button: FC<Props> = ({ children, className, onClick }) => (
    <Btn
        onClick={onClick}
        type="button"
        className={clsx(
            'disabled:bg-gray-600 rounded-md',
            className
        )}
    >
        {children}
    </Btn>
);

export default Button;
