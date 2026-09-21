class Dice {

  static random() {
    return Math.random()
  }

  static d(n) {
    return Math.floor( Dice.random()*n )+1
  }

  // n: number of dice
  // d: number of sides on each dice
  // c: add constant
  // example: n=2, d: 6, c=3
  // rolls with 2 6-sided dice and adds 3 to the result
  static roll_ndc(n, d, c) {
    let sum = 0
    for( let i=0; i<n; i++ )
      sum += Dice.d(d)
    sum += c
    return sum
  }

  // parses a string to identify a dice roll
  // example "foo +2d6-2 bar" returns 
  parse(s) { 
    let m = s.match(/([+-]?)(\d*)[dDkK](\d+)([+-]?\d*)(.*$)/)
    if(m) {
      let t = {}
      t.prefix = (m[1]!='-' ? 1 : 0)
      t.n = (m[2]!='' ? Number(m[2]) : 1)
      t.d = Number(m[3])
      t.constant = Number(m[4])
      // console.log('rest: ', m[5])
      return [t].concat(this.parse(m[5]))
    } else
      return []
  }
  
  constructor(param) {
    this.data = []
    if( typeof param == 'string')
      this.data = this.parse(param)
    else
      this.data = param

    // console.log(this.data)
  }

  roll() {
    let sum = 0
    for(let i=0; i<this.data.length; i++) 
      sum += Dice.roll_ndc(this.data[i].n, this.data[i].d, this.data[i].constant)

    return sum
  }
  
  
  
}
