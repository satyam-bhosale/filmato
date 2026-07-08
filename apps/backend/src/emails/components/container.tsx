import { Container, Img, Section, type ContainerProps } from "react-email"

export default function FilmatoContainer({ children, ...props }: ContainerProps) {
    return <Container className="mx-auto my-2 py-4 px-7 max-w-116 border-solid border border-neutral-200 rounded-lg" {...props}>
        <Section>
            <Img
                height={30}
                className="object-cover"
                src="https://pub-008ebba2d41c4cd8822afe6bd6c2ce2f.r2.dev/static/logos/wordmark.png"
                alt="filmato-wordmark-logo"
            />
        </Section>
        {children}
    </Container>
}