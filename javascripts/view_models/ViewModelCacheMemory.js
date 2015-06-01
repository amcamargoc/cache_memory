//-------------- Classes  -------------- //
function Cache(size) {
  var self = this
  
  // Attributes
  self.size = parseInt(size)
  self.blocks = []
  
  // Methods
  self.fill_blocks = function() {
    if (self.size <= 1024) {
      for (var i = 0; i < self.size; i++) {
        self.blocks.push(new Block(i))
      }
    }
  }
}

function Block(tag) {
  var self = this
  
  // Attributes
  self.tag = tag
  self.uses = null
  self.ramAddress = null
}

function RamAddress(ramAddress) {
  var self = this

  // Attributes
  self.ramAddress = parseInt(ramAddress)
  self.state = null
  self.blockTag = null
}

function CacheMemoryManagement(cache_size, ramAddresses) {
  self = this

  // Attributes
  self.cache = new Cache(parseInt(cache_size))
  self.ramAddresses = []

  // 'Constructors' function for ramAddresses attribute
  self.cache.fill_blocks()
  for (i in ramAddresses) { 
    self.ramAddresses.push(new RamAddress(ramAddresses[i].trim()))
  }

  // Methods of classes
  self.directMapping = function() {
    for (var i in self.ramAddresses) {
      ramAddress = self.ramAddresses[i].ramAddress
      self.ramAddresses[i].state = is_hit(ramAddress) ? 'hit' : 'miss'
      var cacheAddress = ramAddress % self.cache.size
            
      if (isNaN(cacheAddress)) {
        alert('Inputs incorrectos (verficar el tamaño de la cache o las direcciones requeridas)')
      } else {
        self.ramAddresses[i].blockTag = cacheAddress
        self.cache.blocks[cacheAddress].ramAddress = ramAddress
        console.log(self.ramAddresses[i])
      }
    }
  }

  // 'privates' Methods
  function is_hit(ramAddress) {
    for (var i in self.cache.blocks) {
      if (self.cache.blocks[i].ramAddress === ramAddress) {
        return true
      }
    }
    return false
  }
}


//-------------- View-Model -------------- //

function CacheMemoryVM() {
  var self = this
  self.change = true

  // Attributes
  self.cacheSize = ko.observable(4)
  self.sets = ko.observable(2)
  self.ramAddresses = ko.observable("0\n8\n0\n6\n8")
  self.cacheMemory = ko.observableArray();
    
  self.addressesArray = ko.computed(function() {
    return self.ramAddresses().trim().split('\n')
  })

  self.fillMemoryCache = ko.computed(function() {
    if(self.change === true) {
      for (var i = 0; i < self.cacheSize(); i++) {
        self.cacheMemory.push( {tag: i} )
      }
    } 
  })

  self.replace = function(index, element) {
    self.cacheMemory.replace(self.cacheMemory()[index], element);
  }

  self.cacheDirect = function() {
    self.change = false
    cacheManagement = new CacheMemoryManagement(self.cacheSize(), self.addressesArray())
    cacheManagement.directMapping()
    console.log(cacheManagement.cache)
    console.log(cacheManagement.ramAddresses)
    console.log(self.cacheMemory())
    location.href = "game.html"
  }

  self.iterateOnCache = function() {
    self.change = false
    var i = 0
    var thread = setInterval(function() { 
      console.log(i)
      self.replace(i, {tag: 'here'})
      if (i  === self.cacheSize() - 1) {
        self.replace(i - 1, {tag: i - 1})
        i = 0
      } else {
        i === 0 ? self.replace(self.cacheSize() - 1, {tag: self.cacheSize() - 1}) : self.replace(i - 1, {tag: i - 1})
        i =  i + 1
      }      
    }, 1000)

    //for (var i = 0; i < self.cacheSize(); i++) {
      //self.replace(i, {tag: 'here'})
      //console.log('0entreoo')
    //}
  }
}


control = new CacheMemoryVM()
ko.applyBindings(control)