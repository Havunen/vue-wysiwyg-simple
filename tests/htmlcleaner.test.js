import {htmlCleaner} from "../src/editor/sanitizer/htmlCleaner";
import {emailTest} from "./testdata/emailtest";
import {wysiwygExample} from "./testdata/wysiwygexample";


describe('htmlCleaner', () => {
  it('Should remove all illegal tags <script>', () => {
    const result = htmlCleaner('<div><script>alert("hacked")</script></div>')

    expect(result).toBe('')
  })

  it('Should remove all attributes tags', () => {
    const result = htmlCleaner('<div onclick="foo"><script>alert("hacked")</script></div>')

    expect(result).toBe('')
  })

  it('Should remove all image and video tags', () => {
    const result = htmlCleaner('<div onclick="foo"><script>alert("hacked")</script></div><video></video><img src="testi.png"/>')

    expect(result).toBe('')
  })

  it('Should dangerous link hrefs', () => {
    const result = htmlCleaner('<p><a href="javascript:foobar">test</a><a href="data:foo/">test1</a></p>')

    expect(result).toBe('<p><a target="_blank" rel="noopener noreferrer">test</a><a target="_blank" rel="noopener noreferrer">test1</a></p>')
  })

  it('Should dangerous link hrefs', () => {
    const result = htmlCleaner('<p><a href="javascript:foobar">test</a><a href="data:foo/">test1</a></p>')

    expect(result).toBe('<p><a target="_blank" rel="noopener noreferrer">test</a><a target="_blank" rel="noopener noreferrer">test1</a></p>')
  })

  it('Should not remove BR tags', () => {
    const result = htmlCleaner('<p>hello<br>again</p>')

    expect(result).toBe('<p>hello<br>again</p>')
  });

  it('Should clean email copy pasted HTML', () => {
    const result = htmlCleaner(emailTest)

    const resultWhitespaceRemoved =result.replace(/\s/g, "")

    expect(resultWhitespaceRemoved).toBe('<div><div>URLLinkTitleInsert</div></div><div><p><span></span></p><p><span>________________________________________________________________________________</span></p><p><span>MicrosoftTeamsmeeting</span></p><p><b><span>Joinonyourcomputer,mobileapporroomdevice</span></b></p><p><span><ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>Clickheretojointhemeeting</span></a></span></p><p><span>MeetingID:</span><span>112112112</span><span><br></span><span>Passcode:</span><span>asdasdi2</span></p><p><span><ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>DownloadTeams</span></a>|<ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>Joinontheweb</span></a></span></p><p><b><span>Orcallin(audioonly)</span></b></p><p><span><ahref="tel:123123312213#"target="_blank"rel="noopenernoreferrer"><span>+3231123#</span></a></span><span>Finland,Helsinki</span></p><p><span>PhoneConferenceID:</span><span>213123312321321#</span></p><p><span><ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>Findalocalnumber</span></a>|<ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>ResetPIN</span></a></span></p><p><span><ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>LearnMore</span></a>|<ahref="https://www.google.com"target="_blank"rel="noopenernoreferrer"><span>Meetingoptions</span></a></span></p><p><span>________________________________________________________________________________</span></p><p><span></span></p></div>')
  })

  it('Should never remove text content', () => {
    const result = htmlCleaner(wysiwygExample)

    expect(result.replaceAll(/\s/g, "")).toBe(`<p>Welcometo<b>vue-wysiwyg-simple</b>!</p><p><br></p><br><p>Theeditorisquitefastandlightweight.Elementsareminimallystyled.</p><br>Numberedlists:Non-numberedlists:<li>Item#1</li><li>Item#2</li><ul><li>Item#1</li><li>Item#2</li></ul>`.replace(/\s/g, ""))
  })

  it('Should remove unicode control characters', () => {
    const result = htmlCleaner('\u0001\u0001\u0001\u0001\u0001\u0001'+wysiwygExample)

    expect(result.replaceAll(/\s/g, "")).toBe(`<p>Welcometo<b>vue-wysiwyg-simple</b>!</p><p><br></p><br><p>Theeditorisquitefastandlightweight.Elementsareminimallystyled.</p><br>Numberedlists:Non-numberedlists:<li>Item#1</li><li>Item#2</li><ul><li>Item#1</li><li>Item#2</li></ul>`.replace(/\s/g, ""))
  })
})
