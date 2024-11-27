'use client'
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import './chatbot.css';
import Lottie from 'react-lottie-player';
import { Image } from '@chakra-ui/react';
import Data from './Animation.json'
import ReactMarkdown from 'react-markdown'

const ChatbotIcon = () => {
    const renderTooltip = (props) => (
        <Tooltip  {...props}>
            <div style={{ backgroundColor: 'black', padding: '5px', fontSize: '12px', margin: '10px' }}> Need help? Try Chat Support</div>
        </Tooltip>
    );

    return (
        <OverlayTrigger
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
            placement="top"
        >
            <Image src='/chatbot/aiiq_icon.png' />

        </OverlayTrigger>

    )
}

function Bot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [toggleSize, setToggleSize] = useState(false)
    const chatContainerRef = useRef(null);
    const [showEndConfirmation, setShowEndConfirmation] = useState(false)


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);




    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    async function handleEndSession() {


        try {

        } catch (error) {
            console.log(error)


        }

    }


    const handleSend = async (text) => {




    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {

                handleSend(text)
            }
        }
    };

    return (

        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <div className="chatbot-icon" onClick={toggleChatbot}>
                    <ChatbotIcon />
                </div>
            )}
            {isOpen && (
                <div className={toggleSize ? "chatbot-window-big" : "chatbot-window"}>
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                            <div style={{ fontSize: '14px', marginLeft: '5px' }}>
                                SL Chatbot powered by AiiQ
                            </div>

                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <button onClick={toggleChatbot} className='header-icon'>
                                <Image style={{ width: '15px', height: '15px' }} src='/chatbot/minimize1_icon.png' />
                            </button>
                            <button onClick={() => setToggleSize(!toggleSize)} className='header-icon' >
                                <Image style={{ width: '15px', height: '15px' }} src={toggleSize ? '/chatbot/minimize_icon.png' : '/chatbot/maximize_icon.png'} />
                            </button>
                            <button onClick={() => setShowEndConfirmation(true)} className='header-icon'>
                                <Image style={{ width: '15px', height: '15px' }} src={'/chatbot/cross_icon.png'} />
                            </button>
                        </div>
                    </div>
                    {
                        <div className="chatbot-body" ref={chatContainerRef}>
                            {messages.map((message, index) => (
                                message.by == 'ai'
                                    ?
                                    message.msg == 'loading' ?
                                        <Lottie
                                            key={index}
                                            loop
                                            animationData={Data}
                                            play
                                            style={{ width: '100px', }}
                                        />
                                        :
                                        <div key={index} className={`message-container-${message.by}`}>
                                            <div className='ai-div-container'>
                                                <Image className='ai-img' src={'/chatbot/aiiq_icon.png'} />
                                             
                                            </div>
                                            <div className='message-ai'>
                                                <div className="markdown">
                                                    <ReactMarkdown>
                                                        {message.msg}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        </div>
                                    :
                                    <div key={index} className={`message-container-${message.by}`}>
                                        <div className='message-user'>
                                            {message.msg}
                                        </div>
                                        <div className='user-div-container'>
                                            <Image className='user-img' src={'/chatbot/user.svg'} />
                                           
                                        </div>
                                    </div>
                            ))}
                        </div>
                    }

                    <div className="chatbot-footer">
                        {showEndConfirmation ?
                            <div className='end-chat'>
                                <div style={{ color: 'black' }}>
                                    End Chat?
                                </div>
                                <button className='history-icon' style={{ width: '100px' }} onClick={() => handleEndSession()}>
                                    Yes
                                </button>

                                <button className='history-icon' style={{ width: '100px' }} onClick={() => setShowEndConfirmation(false)}>
                                    No
                                </button>

                            </div>
                            :

                            <>
                                <textarea
                                    disabled={messages[messages.length - 1]?.msg === "loading"}
                                    className='textStyle'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    onKeyDown={handleKeyDown}
                                />
                                <Image onClick={() => {
                                    if (input.trim()) {
                                        const text = input
                                        setInput('')
                                        setMessages((prevMessages) => {
                                            const newState = [...prevMessages]
                                            newState.push({
                                                'by': 'user',
                                                'msg': text
                                            })
                                            newState.push({
                                                by: "ai",
                                                msg: "loading",
                                            });
                                            return newState
                                        })
                                        handleSend(text)
                                    }

                                }} style={{ height: '30px', width: '30px', marginRight: '10px', marginLeft: '10px' }} src={'/chatbot/send_icon.png'} />
                            </>
                        }

                    </div>
                </div>
            )}
        </div>

    );
}

export default Bot;
