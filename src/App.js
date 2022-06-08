import { useState } from "react"

function App() {
  const [form, setForm] = useState({
    email: "",
    hashtag: "",
    standardAlgorithm: true,
    isEveryday: false
  })
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isHashTagValid, setIsHashtagValid] = useState(true)
  const [isSent, setIsSent] = useState(false)

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function handleSubmission(e) {
    // to prevent refreshing page
    e.preventDefault();

    // check for valid email
    const email = form.email
    const atIndex = email.indexOf('@')
    if (
      atIndex <= 0 ||
      email.indexOf('.') <= atIndex + 1 ||
      email.length < 5
    ) {
      setIsEmailValid(false)
      return
    } else setIsEmailValid(true)

    //check for valid hashtag
    const hashtag = form.hashtag
    if (hashtag.length === 0 || hashtag.indexOf(' ') !== -1) {
      setIsHashtagValid(false)
      return
    } else setIsHashtagValid(true)

    // add document to DB
    await fetch('https://twitter-trendifier-server.herokuapp.com/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...form })
    })
    .catch(error => window.alert(error))
    setIsSent(true)
  }

  return (
    <div className="App">
      <h4 className="logo"><span className="blue">Twitter </span>Trendifier</h4>
      <form className='form' onSubmit={handleSubmission}>
        <input
          id="email"
          className='input'
          type="text"
          value={form.email}
          onChange={(e) => updateForm({ email: e.currentTarget.value })}
          placeholder="Email"
        />
        <input
          id="hashtag"
          className='input'
          type="text"
          value={form.hashtag}
          onChange={(e) => updateForm({ hashtag: e.currentTarget.value })}
          placeholder="#hashtag"
        />
        <div className="checkbox-container">
          <input
            id="stats"
            className="checkbox"
            type="checkbox"
            name="stats"
            value={form.isEveryday}
            onChange={(e) => updateForm({ isEveryday: e.currentTarget.checked })}
          />
          <label className="checkbox-label" htmlFor="stats">Send stats everyday</label>
        </div>
        <div className="algorithm-container">
          <h4 className="algorithm-prompt">Compare today to</h4>
          <div className="radio-container">
            <input
              id="standard"
              className="radio"
              type="radio"
              name="algorithm"
              value={form.standardAlgorithm}
              checked={form.standardAlgorithm}
              onChange={(e) => updateForm({ standardAlgorithm: e.currentTarget.checked })}
            />
            <label className="radio-label" htmlFor="standard">previous 30 days</label>
            <br />
            <input
              id="non-standard"
              className="radio"
              type="radio"
              name="algorithm"
              value={!form.standardAlgorithm}
              onChange={(e) => updateForm({ standardAlgorithm: !e.currentTarget.checked })}
            />
            <label className="radio-label" htmlFor="non-standard">previous days of the week <span className="parenthesis">(e.g. Tuesday)</span></label>
          </div>
        </div>
        <div className="form-bottom">
          <button className={isSent ? 'button checked' : "button"}><nobr>Subscribe<span hidden={!isSent}>d</span></nobr></button>
          <p className="error-message">{isEmailValid ? '' : 'Invalid email'}</p>
          <p className="error-message">{isHashTagValid ? '' : 'Invalid hashtag'}</p>
        </div>
      </form>
      <p className='description'>{!isSent ? 
        !form.isEveryday ? 'Subscribe to receive an email whenever the specified hashtag is trending on Twitter.' :
        'Subscribe to receive statistics about the specified hashtag everyday.' :
        !form.isEveryday ? 'You will be notified whenever this hashtag begins to trend on Twitter.' :
        'You will be notified everyday with the specified hashtag`s statistics.'}</p>
    </div>
  );
}

export default App;
