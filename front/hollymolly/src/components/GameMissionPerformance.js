import styled from "styled-components";
import React, { useState, useEffect, useRef } from 'react';
import style from '../styles/styles';
import axios from 'axios';
import night from '../assets/night.svg';
// 소켓
import { io } from 'socket.io-client';

// local storage에 있는지 확인 
let data = localStorage.getItem("token");
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;



const GameMissionPerformance = (props) => {
   
    const {role} = props;
    const [isHuman, setIsHuman] = useState(false);
    const [seconds, setSeconds] = useState(5); //게임 시작 5초 후, 타이머

    const inputRef = useRef();

    let user_role = role;
    useEffect(() => {

        const socket = io('http://3.17.55.178:3002/', {
            auth: {
                token: save_token
            },
        });

        socket.on('connect', () => {
            console.log('GameMissionPerformance connection server');
        });

        if(user_role === "human"){ // human 일 때 마피아 미션 수행 
            setIsHuman(true);
        }else{ // ghost 일 때 마피아 미션 수행 기다림 
            setIsHuman(false);
        }

        // 인간 답안 제출 완료 
        socket.on('submit human answer', (data) => {
            console.log('submit human answer');
            
            if(data.human_submit === true){
                // 여기서 투표 결과 페이지로 넘기면 될듯 합니다
            }
        });
    }, []);

    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }else{ // seconds == 0이면,
                 //inputHumanKeyword();
            }
        }, 1000);

        return () => {clearInterval(countdown); console.log('게임 롤 초 끝')} ;
    }, [seconds]);

    const inputHumanKeyword = async () => {
        const reqURL = 'http://3.17.55.178:3002/game/human-keyword'; //parameter : 방 타입
        const reqHeaders = {
            headers: {
                authorization: 'Bearer ' + save_token,
            },
        };

        axios
            .patch(
                reqURL,
                {
                    game_set_idx: 1, // 게임 세트 인덱스 
                    game_set_human_answer: inputRef.current.value // 인간이 입력한 답안 
                },
                reqHeaders
            )
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            });
    };

    const onClick = () => {
        inputHumanKeyword();
    };

      return (
        <React.Fragment>
                {isHuman? 
                /* 인간일 때, 제시어 입력 */
                <Container> 
                    <TimerContext>{seconds}초</TimerContext>
                    <Context>예상 제시어를 적어주세요</Context>
                    <InputHumanKeyword><input style={styles.input} type="text" placeholder="입력하세요..." ref={inputRef} /></InputHumanKeyword>
                    <SubmitContainer onClick={onClick}><SubmitContext>제출</SubmitContext></SubmitContainer>
                </Container> :
                /* 유령일 때, 인간 제시어 입력 기다림 */
                <Container>
                    <Context><HumanContext>인간</HumanContext>이 미션 수행중입니다 ....</Context>
                    <TimerContext>{seconds}초</TimerContext>
                </Container> }
        </React.Fragment>
      );
  };
  
const Container = styled.div`
    width: 650px;
    height: 620px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`; 

const Context = styled.text`
    color: #ffffff;
    font-size: 40px;
    font-family: Nanum Pen Script;
    -webkit-text-stroke: 1px #4d1596;
`;

const HumanContext = styled.text`
    color: #ff0000;
    font-size: 40px;
    font-family: Nanum Pen Script;
    -webkit-text-stroke: 1px #4d1596;
`;

const TimerContext = styled.text`
    color: #D9A1F3;
    font-size: 40px;
    font-family: Nanum Pen Script;
    -webkit-text-stroke: 1px #4d1596;
`;

const InputHumanKeyword = styled.div`
    background-color: #ffffff;
    width: 300px;
    height: 60px;
    border-radius: 0.5rem;
    box-shadow: 7px 5px 5px #2D2C2C;
    margin-top: 20px;
    outline: none;
    font-size: 30px;
    text-align: center; 
`;

const SubmitContainer = styled.div`
    background-color: #D9A1F3;
    width: 60px;
    height: 40px;
    border-radius: 0.8rem;
    box-shadow: 7px 5px 5px #2D2C2C;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SubmitContext = styled.div`
    color: #000000;
    font-size: 15px;
    font-family: Gowun Dodum;
    text-align: center;
`;

  export default GameMissionPerformance;

  const styles = {
    input: {
        borderRadius: '0.5rem',
        color: style.black,
        height: '60px',
        width: '300px',
        fontSize: 30,
        outline: 'none',
        textAlign: 'center',
        fontFamily: 'Black Han Sans'
    },
};