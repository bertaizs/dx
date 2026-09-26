class Dice {

  static options = {
    log_data: true,
    log_parsing: false,
    log_rolls: true,
  }

  //                    prefix
  //                           # of dice
  //                                D
  //                                      type of dice
  //              OR
  //                                            +- constant
  //                                                      whatever remains
  static regex = /^\s*(([+-]?)(\d*)[dDkK](\d+)|([+-]?\d+))(.*$)/
  
  // static regex = /^\s*(([+-]?)(\d*)[dDkK](\d+))|([+-]?\d+|)(.*$)/
  // static regex = /((al.*ma)|(k.*te))(.*)/
  // static regex = /^\s*(([+-]?)(\d*)[dDkK](\d+)|([+-]?\d+|))(.*$)/
//  static regex = /([+-]?)(\d*)[dDkK](\d+)([+-]?\d+|)(.*$)/
  
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
      if( m[2]!=undefined ) {
        Dice.options.log_parsing && console.log('match: dice roll', m)
        t.prefix = (m[2]!='-' ? 1 : -1)
        t.n_of_dice = (m[3]!='' ? Number(m[3]) : 1)
        t.dice_type = Number(m[4])
      } else {
        Dice.options.log_parsing && console.log('match: constant', m)
        t.constant = Number(m[5])
      }
      Dice.options.log_parsing && console.log('t', t)
      return [t].concat(this.parse(m[6]))
    }
    Dice.options.log_parsing && console.log('no match!')
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

  // t.prefix: die rolls will be added (1) or subtracted (-1)
  // t.n_of_dice: number of dice
  // t.dice_type: number of sides on each dice
  // t.constant: add constant
  // example: n=2, d: 6, c=3
  // rolls with 2 6-sided dice and adds 3 to the result
  roll_t(t) {
    t.constant ??= 0
    t.prefix ??= 1
    t.n_of_dice ??= 0
    t.dice_type ??= 0

    let sum = 0
    for( let i=0; i<t.n_of_dice; i++ ) {
      let this_die = Dice.d(t.dice_type)
      this.rolls.push(this_die)
      sum += this_die
    }
    sum = t.prefix*sum + t.constant
    return sum
  }
  
  roll() {
    this.rolls = []
    let sum = 0
    for(let i=0; i<this.data.length; i++)
      sum += this.roll_t(this.data[i])

    Dice.options.log_rolls && console.log('rolls:', this.rolls)    
    this.last_roll = sum
    return this.last_roll
  }

  get_last() { return this.last_roll }
  last() {return this.get_last()}
  
} // Dice
