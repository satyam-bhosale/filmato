import { Button, type ButtonProps } from "react-email";

export default function FilmatoButton({children, ...props} : ButtonProps){
    return (
        <Button 
        className="text-yellow-400 py-3 px-5 text-sm font-medium bg-violet-950 rounded-lg cursor-pointer" {...props}>
            {children}
        </Button>
    )
}