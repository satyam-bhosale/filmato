import FilmatoContainer from "@filmato/backend/emails/components/container.js"
import FilmatoFooter from "@filmato/backend/emails/components/footer.js"
import BaseLayout from "@filmato/backend/emails/layout/base-layout.js"
import { Body, Heading, Preview, Section, Text } from "react-email"

type Props = {
    otp: string
}

export default function ResetPasswordOTPTemplate({ otp }: Props) {
    return (
        <BaseLayout>
            <Body>
                <Preview>Reset your password securely. This link expires in 10 minutes.</Preview>
                <FilmatoContainer>
                    <Section>
                        <Heading as="h2" className="text-xl py-0">
                            Reset your password for Filmato
                        </Heading>
                        <Text className="text-sm font-medium">
                            Hey there, received a request to reset your Filmato account password. Use the below code to set a new password.
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