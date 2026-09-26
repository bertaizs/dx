class Dice {

  static options = {
    log_data: true,
    log_parsing: false,
    log_rolls: true,
  }

  static regex = /([+-]?)(\d*)[dDkK](\d+)([+-]?\d+|)(.*$)/
  
  // this is going to be our random source; returns a float value between 0 and 1
  static random() {
    return Math.random()
  }

  // rolls an n-sided die (number between 1 and n) and returns the result
  static d(n) {
    return Math.floor( Dice.random()*n )+1
  }

  // parses a string to identify a dice roll
  // example "foo +2d6-2 bar" returns 
  parse(s) { 
    let m = s.match(Dice.regex)
    if(m) {
      let t = {}
      t.prefix = (m[1]!='-' ? 1 : -1)
      t.n = (m[2]!='' ? Number(m[2]) : 1)
      t.d = Number(m[3])
      t.constant = Number(m[4])
      if( isNaN(t.constant) ) t.constant = 0
      
      Dice.options.log_parsing && console.log('rest:', m[5])
      // console.log('rest: ', m[5])
      return [t].concat(this.parse(m[5]))
    } else
      return []
  }
  
  constructor(param) {
    this.data = []
    this.last_roll = undefined
    this.rolls = []
    
    if( typeof param == 'string')
      this.data = this.parse(param)
    else
      this.data = param

    Dice.options.log_data && console.log('data:', this.data)
  }

  // p: die rolls will be added (1) or subtracted (-1)
  // n: number of dice
  // d: number of sides on each dice
  // c: add constant
  // example: n=2, d: 6, c=3
  // rolls with 2 6-sided dice and adds 3 to the result
  roll_ndc(pref, n, d, c) {
    let sum = 0
    for( let i=0; i<n; i++ ) {
      let this_die = Dice.d(d)
      this.rolls.push(this_die)
      sum += this_die
    }
    sum = pref*sum + c
    return sum
  }
  
  roll() {
    this.rolls = []
    let sum = 0
    for(let i=0; i<this.data.length; i++)
      sum += this.roll_ndc(this.data[i].prefix, this.data[i].n, this.data[i].d, this.data[i].constant)

    Dice.options.log_rolls && console.log('rolls:', this.rolls)
    
    this.last_roll = sum
    return this.last_roll
  }

  get_last() { return this.last_roll }
  last() {return this.get_last()}
  
} // Dice
