import React, {useEffect, useState} from 'react';
import './PaymentTable.css';
import {NewPayment} from "./NewPayment";
import moment from "moment";
import 'moment/locale/pl';

export const PaymentTable = (props) => {
    const [payments, setPayments] = useState([]);
    const [paymentsCounter, setPaymentsCounter] = useState(0);
    const [toPay, setToPay] = useState(0);
    const [paid, setPaid] = useState(false);
    const [newPayment, setNewPayment] = useState(false);
    const [edit, setEdit] = useState(false);
    const [acceptButtonText, setAcceptButtonText] = useState("Zatwierdz platnosci");

    function addPayment() {
        setNewPayment(!newPayment);
    }

    function acceptPayments() {
        setEdit(!edit);
        setAcceptButtonText(() => buttonText());

        if (edit) {
            fetch('http://127.0.0.1:8000/payment/setpaid', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(getObjArray())
            }).then(res => res.json())
                .then(res => console.log(res));
        }
    }

    function getObjArray() {
        let arr = [];
        payments.map(payment => {
            arr.push({id: payment.pk, paid: payment.fields.paid})
        });
        return arr;
    }

    function paymentsToString() {
        let result = '';
        payments.forEach(payment => {
            result += objToString(payment);
        });
        return result.substring(0, result.length - 1);
    }

    function objToString(obj) {
        return '{"id":' + obj.pk + ', "paid":' + obj.fields.paid + '},';
    }

    function buttonText() {
        return edit ? "Zatwierdz platnosci" : "Zapisz";
    }

    function checkCheckbox(obj) {
        obj.paid = !obj.paid;
        let newState = Object.assign([], payments);
        Object.assign(newState.find(x => x['pk'] === obj['pk']), obj);
        setPayments(newState);
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/payment/findpaymentbypersonandgroup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "person": props.user
            })
        })
            .then(response => response.json())
            .then(data => {
                data.map(item => {
                    payments.push(item)
                });
                setPaymentsCounter(data.length);
                console.log(payments);
                console.log(data);
            });
    }, []);

    return (
        <div>
            <h4>Płatności użytkownika</h4>
            <table id='paymentTable'>
                <tr>
                    <th>Nr</th>
                    <th>Opis</th>
                    <th>Kwota</th>
                    <th>Data</th>
                    <th>Osoba płacąca</th>
                    <th>Osoba przyjmująca</th>
                    <th>Zapłacono</th>
                </tr>
                {paymentsCounter > 0 &&
                payments.map((value, index) => {
                    moment().locale('pl');
                    return (<tr key={(++index)}>
                            <td>{index}</td>
                            <td>{value.details}</td>
                            <td>{value.amount} PLN</td>
                            <td>{moment(value.approved).format('lll')}</td>
                            <td>{value.student}</td>
                            <td>{value.assistant}</td>
                            <td>
                                <input type="checkbox"
                                       checked={value.paid}
                                       onChange={() => checkCheckbox(value)}
                                       disabled={!edit}/>
                            </td>
                        </tr>
                    )
                })
                }
            </table>
            <br/>
            {sessionStorage.getItem('userType') === "CUSTOMER_ASSISTANT" &&
            <button onClick={addPayment}>Dodaj płatność</button>}
            {'   '}
            {sessionStorage.getItem('userType') === "CUSTOMER_ASSISTANT" &&
            <button onClick={acceptPayments}>{acceptButtonText}</button>}
            {newPayment &&
            <NewPayment user={props.user}/>}
        </div>
    );
}