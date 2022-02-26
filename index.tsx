import React, { useState, useMemo, useEffect } from 'react';
import { render } from 'react-dom';
import { isValidUserName } from './utils';
import './style.css';
const messageInititalState = { message: '', type: '' };
const App = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [terms, setTerms] = useState('');
  const [showMessage, setShowMessage] = useState(messageInititalState);
  const token = sessionStorage.getItem('token');

  const onSubmit = async (event) => {
    event.preventDefault();
    const { username, password, terms } = event.target;
    const payload = {
      email: username.value,
      password: password.value,
      // email: "eve.holt@reqres.in",
      // password: "cityslicka"
    };

    await fetch('https://reqres.in/api/login ', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token) {
          sessionStorage.setItem('token', res.token);
          setShowMessage({
            message: 'Login Success! Token saved.',
            type: 'success',
          });
          setTimeout(() => {
            setShowMessage(messageInititalState);
          }, 3000);
        } else {
          throw res.error;
        }
      })
      .catch((message) => {
        setShowMessage({
          message: message,
          type: 'failure',
        });
        setTimeout(() => {
          setShowMessage(messageInititalState);
        }, 3000);
      });
  };

  const isDisabled = useMemo(() => {
    return !(isValidUserName(userName) && password.length >= 8 && terms);
  }, [userName, password, terms]);

  useEffect(() => {
    let timer;
    const startTime = () => {
      if (token) {
        console.log('timer set');
        timer = setTimeout(() => {
          console.log('timer unset');
          sessionStorage.clear();
        }, 5000);
      }
    };
    if (!timer && token) {
      startTime();
    }
    const resetTimer = () => {
      if (token) {
        console.log('timer reset');
        clearTimeout(timer);
        startTime();
      }
    };

    window.addEventListener('keypress', resetTimer);
    return () => window.removeEventListener('keypress', resetTimer);
  }, [token]);

  return (
    <div className="loginForm">
      <img src="https://drive.google.com/uc?export=view&id=1hvRAGrdq0SqFBZApx2--IcuDf-DOmOBH" />
      <div>Hello there, Sign In to continue</div>
      <form onSubmit={onSubmit}>
        <div>
          <label className="fullWidthLabel" htmlFor={'email'}>
            Email
          </label>
          <input
            name="username"
            required
            type="email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="relative">
          <label className="fullWidthLabel" htmlFor={'password'}>
            Password
          </label>
          <input
            name="password"
            required
            type={!showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassWord(e.target.value)}
          />
          <div
            className="visiblePassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABB0lEQVRIie2UQQ4BQRBFHxEbbKwljmK4jgMIsccx3EBwAlYuMDsrwQEsrGQs/BGZqRpjMWLhJ5VOuv7/3V3dXfDHr6MJ9IE1cACuioPm+uJ8jAowBC5A9CYu4lbymreAXQ7jZOykzUQb2BviBdABaooAWBq8vTxM1IHQEA0yNjQy+KG8Upg7OweoAjPgBByBqeYAVoZunjQPDFLEoyzIMJmbKtd1tMHrAluHFB/1ZOTOyjUc7QagbNXKQGTM3TSW8hh4JYqPaZVoolzvjfYJ65KXylW1yJH0Ja8NXeqSwX+mo4yTjw2++0zB/2grHq+lrug5O8/8aDEKbRUxCm12ryisXf/xPdwBDK+4/Rf2HhIAAAAASUVORK5CYII=" />
            ) : (
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACUElEQVRoge3Zv2pUQRTH8c+ufyr/gCkkIhIEbSSQVxC1kDyBptQIIkJ6tUyhJgoWFpJUFgn+AxWfwNZGjC+gYNBAFDvRGIvZq3fjJpm5e5e7IfcHh7vM7p35znDOmZmz1Kq1vbWjaoAINTCGYSxUzJKsJmaw2rLz1eKkaS38lppAJ/iZVnvfq4H72uFn1fC91/aEb5QI0cRRHMcx7MHe1ndf8R0f8K71zL/3ABdybbO4hN8l8nXUQVzBcyxrX8GN7EYOvpJscwav8DMBOrOpKuFP400B6MrhD+FRAugyHmMaN/EEk5HwU5jDQFnwZ/ElEvwzxrFrnb5i4LP2RYx2C39NyAQx8As4skFfKfCZrWCiCHgT9yLBs5VfCz+CwS7g83ZXQnw0hTycEpzjuff3C/4fG7CbwWcWtbF1GiwmYPM+nwI/mTjWhpmqCPxqCzjTSAI8ITuljrfuJMYKdLaaAybe5zPdKjjm34tNGRvHSu7zos3PNoO59lLv5GW4UEzADud+/6zAeKXHQeoOm2k3vpUJn59EbBpNSZVz/h2v4XIifNLlpok7JcEPancbGMJSAvx0CnxeE0KQFoXvpCG8jwT/hatFwPMaFbJLt/C7BbeJXflPwkGyFA1gPgF+Utikbguu+FRawD7EgbLg16qss00ne41TvQLvFfwPvMTJXoLHwF9PgF7EC1zUpavEllViSx+HcUIor+wT8v5OoayyJNzs3uJjN9Cp2p4Vs35QDV+VtvSfC/x/M9tS8LRPoO/hO+0DDZwTJjDfetaqVatP9QdYgjxm21BnTQAAAABJRU5ErkJggg==" />
            )}
          </div>
        </div>
        <div>
          <label className="termsWrapper">
            <input
              name="terms"
              required
              type="checkbox"
              value={terms}
              onChange={() => setTerms(!terms)}
            />
            <span>
              By creating and logging into an account, you are agreeing with our
              <b> Terms and Conditions</b> and <b> Privacy Policys</b>.
            </span>
          </label>
        </div>
        <button disabled={isDisabled} className="submitButton" type="submit">
          Next
        </button>
      </form>
      <div className="infoContainer">
        {showMessage.message && (
          <span
            className={showMessage.type === 'success' ? 'success' : 'failure'}
          >
            {showMessage.message}
          </span>
        )}
      </div>
      <div className="secondaryLoginOption">
        <a href="#">Sign In with Company SSO</a>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
