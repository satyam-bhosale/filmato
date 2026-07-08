import FilmatoContainer from "@filmato/backend/emails/components/container.js"
import FilmatoFooter from "@filmato/backend/emails/components/footer.js"
import BaseLayout from "@filmato/backend/emails/layout/base-layout.js"
import { Body, Heading, Preview, Section, Text } from "react-email"

type Props = {
    otp: string
}

export default function VerifyEmailOTPTemplate({ otp }: Props) {
    return (
        <BaseLayout>
            <Body>
                <Preview>Confirm your Filmato account to get started. This link expires soon.</Preview>
                <FilmatoContainer>
                    <Section>
                        <Heading as="h2" className="text-xl py-0">
                            Hey there, Verify your email address
                        </Heading>
                        <Text className="text-sm font-600">
                            Thanks for signing up! To complete your registration and start using Filmato, please verify your email address using the below code.
                        </Text>
                    </Section>
                    <Section className="w-fit px-5 py-0.5 bg-violet-950 text-yellow-400 rounded-xl">
                        <Text className="font-bold tracking-widest text-2xl">
                            {otp}
                        </Text>
                    </Section>
                    <FilmatoFooter />
                </FilmatoContainer>
            </Body>
        </BaseLayout>
    )
}