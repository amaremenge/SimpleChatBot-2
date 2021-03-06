const mysql = require('mysql');

const connectionValue={
    host:'localhost',
    user:'root',
    password: 'Toortoor1!',
    database : 'messages'
}

let connection = mysql.createConnection(connectionValue);
//50초 마다 의무적으로 쿼리를 보냄 = 끊김 방지
let keepAliveInterval = setInterval(()=>{
    connection.query('select 1',(error,results,fields)=>{
        if(error)
            throw error;
    })
},50000);

//db 연결이 끊어졌을 때 db 연결에 대해서 복구하기 위한 부분.
connection.on('err',(err)=>{
    console.log('Database connection Error');
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
        clearInterval(keepAliveInterval);
        connection = mysql.createConnection(connectionValue);
        keepAliveInterval();
    }else if(err.code === 'ECONNREFUSED'){
        
    }
});

//조회용 promise 함수
async function GetResponse(request,sending){
     return new Promise((resolve,reject)=>
        connection.query('SELECT * FROM `message` WHERE `request` = ?',[request],(error, results, fields)=>{
            if(error){
                DBErrorResponse(sending);
                reject(error);
                return;
            }

            let responseData = {
                  'result' :""
            }
            responseData['result'] = results.length==0 ? "등록되지 않은 질문입니다. 질문을 등록하려면 '$add,질문,답변' 형식으로 전송해주세요!" : results[0]['response'];
            sending.json(responseData);
            resolve('ok');
        }));
}

//등록용 promise 함수
function RegisterResponse(request, response, sending){
    return new Promise((resolve,reject)=>{
        connection.query('insert `message` value(?,?)',[request,response],(error,results,fields)=>{
            if(error){
                DBErrorResponse(sending);
                reject(error);
                return;
            }

            let responseData = {
                'result' :""
            }

            responseData['result'] = results['affectedRows'] == 0 ? '등록에 실패하였습니다' : '등록되었습니다';
            sending.json(responseData); 
            resolve('ok');
        })
    });
}

function ErrorResponse(request,response){
    let responseData ={'result':'Invalid Command Form'};
    response.json(responseData);
}

function DBErrorResponse(response){
    let responseData ={'result':'DB Server Down'};
    response.json(responseData);
}

exports.ErrorResponse = ErrorResponse;
exports.GetResponse = GetResponse;
exports.RegisterResponse= RegisterResponse;
