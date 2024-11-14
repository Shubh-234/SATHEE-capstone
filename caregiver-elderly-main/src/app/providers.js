 'use client'


import { ChakraProvider, defineStyleConfig, extendTheme } from '@chakra-ui/react'
import { useEffect } from 'react';
import UserContextProvider from '@/store/context/UserContext';
import { PrimeReactProvider } from 'primereact/api';
import { theme } from '@/data/data';

export function Providers({ children }) {

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const InputStyles = {
        variants: {
            outline: {
                field: {
                    borderColor: '#D0D5DD',
                    bg: '#FFFFFF',
                    _focus: {
                        boxShadow: `0px 0px 1px 1px ${theme.color.shadowColor}`,
                        borderColor: theme.color.shadowColor
                    },
                    _hover: {
                        borderColor: theme.color.border
                    },
                    _disabled: {
                        backgroundColor: '#F9FAFB',
                        borderColor: '#D0D5DD',
                        color: '#667085',
                        boxShadow: "0px 0px 1px 1px #1018280D",
                        opacity: 1,
                        fontSize: '14px'
                    }
                },
            },
        },
    };

    const SelectStyles = {
        variants: {
            outline: {
                field: {
                    backgroundColor: '#ffffff',
                    borderColor: '#D0D5DD',
                    _focus: {
                        boxShadow: `0px 0px 1px 1px ${theme.color.shadowColor}`,
                        borderColor: theme.color.shadowColor
                    },
                    _hover: {
                        borderColor: theme.color.border
                    },
                },
            },
        },
    };

    const TextareaStyles = {
        variants: {
            outline: {
                backgroundColor: '#FFFFFF',
                borderColor: '#D0D5DD',
                _focus: {
                    boxShadow: `0px 0px 1px 1px ${theme.color.shadowColor}`,
                    borderColor: theme.color.shadowColor
                },
                _hover: {
                    borderColor: theme.color.border
                },
                _disabled: {
                    backgroundColor: '#F9FAFB',
                    borderColor: '#D0D5DD',
                    color: '#667085',
                    boxShadow: "0px 0px 1px 1px #1018280D",
                    opacity: 1,
                    fontSize: '14px'
                }
            },
        },
    };

    const TextStyle = {
        variants: {
            'heading': {
                fontWeight: "600",
                fontSize: '30px',
                color: '#000000',
               
            },
            'description': {
                color: '#667085',
                fontWeight: '400',
                fontSize: '16px',
               

            },
            'subheading': {
                fontSize: "14px",
                fontWeight: "500 ",
                color: '#344054',
                

            },
            'link': {
                color: theme.color.link,
                fontWeight: '400',
                fontSize: '16px',
               

            },
        },
    };

    const customTheme = extendTheme({
        components: {
            Input: InputStyles,
            Select: SelectStyles,
            Textarea: TextareaStyles,
            Text: TextStyle
        },
    });

    return (
       
            <PrimeReactProvider>
                    <ChakraProvider theme={customTheme}>
                        <UserContextProvider>
                            {children}
                        </UserContextProvider>
                    </ChakraProvider>
            </PrimeReactProvider>
      
    )
}