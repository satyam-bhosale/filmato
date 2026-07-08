import FilmatoButton from "@filmato/backend/emails/components/button.js"
import FilmatoContainer from "@filmato/backend/emails/components/container.js"
import ExpiringLinkMessage from "@filmato/backend/emails/components/expiring-link-message.js"
import FilmatoFooter from "@filmato/backend/emails/components/footer.js"
import BaseLayout from "@filmato/backend/emails/layout/base-layout.js"
import { Body, Heading, Link, Preview, Section, Text } from "react-email"

type Props = {
    resetPasswordUrl: string
}

export default function PasswordChanged({ resetPasswordUrl }: Props) {
    return (
        <BaseLayout>
            <Body>
                <Preview>Your password was updated successfully. If this wasn’t you, secure your account immediately.</Preview>
                <FilmatoContainer>
                    <Section>
                        <Heading as="h2" className="text-xl py-0">
                            {
                                `Hey there, your password has been changed.`
                            }
                        </Heading>
                        <Text className="text-sm font-600">
                            This is a confirmation that your Filmato account password was changed successfully.
                        </Text>
                        <Text>
                            If you didn’t change your password, please reset it immediately to secure your account.
                        </Text>
                    </Section>
                    <Section className="my-5">
                        <FilmatoButton
                            href={resetPasswordUrl}
                            target="_blank"
                        >
                            <strong>Reset Password</strong>
                        </FilmatoButton>
                    </Section>
                    <Text className="text-xs">
                        Button didn't work? Copy link and paste in your browser:
                    </Text>
                    <Link href={resetPasswordUrl} className="text-xs break-all">
                        {resetPasswordUrl}
                    </Link>
                    <ExpiringLinkMessage expiringIn={10} />
                    <FilmatoFooter />
                </FilmatoContainer>
            </Body>
        </BaseLayout>
    )
}