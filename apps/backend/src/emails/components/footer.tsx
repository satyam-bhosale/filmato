import { Container, Text } from 'react-email'

function FilmatoFooter() {
  const year = new Date().getFullYear()
  return (
    <>
      <Container className='text-center'>
        <Text className='text-xs text-neutral-600'>
          {`© ${year} Filmato. All rights reserved.`}<br/>
          123 Film Street, Los Angeles, CA 90001
        </Text>
      </Container>
    </>
  )
}

export default FilmatoFooter