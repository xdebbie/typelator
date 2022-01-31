import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useTheme } from '../utils/ThemeManager'
import { ReactComponent as Github } from '../assets/github.svg'
import { ReactComponent as Medium } from '../assets/medium.svg'
import { ReactComponent as Twitter } from '../assets/twitter.svg'

const Wrapper = styled.footer`
    color: white;
    flex-shrink: 0;
    margin-top: 20px;
    padding: 20px 0;
    text-align: center;
`

const Links = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 5px;

    .github,
    .twitter,
    .medium {
        fill: rgba(239, 239, 239, 0.75);
        height: 25px;
        margin-right: 5px;
        transition: 300ms all ease;
        width: 25px;

        &:hover {
            fill: white;
        }
    }
`

const Text = styled.div`
    font-size: 12px;
`

function Footer() {
    const theme = useTheme()
    return (
        <ThemeProvider theme={{ mode: theme.mode }}>
            <Wrapper>
                <Links>
                    <a
                        href="https://github.com/xdebbie"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Github className="github" />
                    </a>
                    <a
                        href="https://twitter.com/gitdebbie"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Twitter className="twitter" />
                    </a>
                    <a
                        href="https://medium.com/@ithos"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Medium className="medium" />
                    </a>
                </Links>
                <Text>© 2022 kotka&bowie</Text>
            </Wrapper>
        </ThemeProvider>
    )
}

export default Footer
