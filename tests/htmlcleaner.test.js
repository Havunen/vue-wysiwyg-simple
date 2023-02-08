import {htmlCleaner} from "../src/editor/sanitizer/htmlCleaner";


describe('htmlCleaner', () => {
  it('Should remove all illegal tags <script>', () => {
    const result = htmlCleaner('<div><script>alert("hacked")</script></div>')

    expect(result).toEqual('<div></div>')
  })

  it('Should remove all attributes tags', () => {
    const result = htmlCleaner('<div onclick="foo"><script>alert("hacked")</script></div>')

    expect(result).toEqual('<div></div>')
  })
})
