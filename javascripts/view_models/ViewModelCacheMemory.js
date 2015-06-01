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
      self.ramAddresses[i].blockTag = cacheAddress
      self.cache.blocks[cacheAddress].ramAddress = ramAddress
      console.log(self.ramAddresses[i])
      
      if (isNaN(cacheAddress)) {
        alert('Inputs incorrectos (verficar el tamaño de la cache o las direcciones requeridas)')
      } else {
        console.log(cacheAddress)
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

  // Attributes
  self.cacheSize = ko.observable(0)
  self.ramAddresses = ko.observable('')
  self.cacheMemory = ko.observableArray();
    
  self.addressesArray = ko.computed(function() {
    return self.ramAddresses().trim().split('\n')
  })

  self.memoryCache = ko.computed(function() {
    //self.cacheMemory().length = 0
    for (var i = 0; i < self.cacheSize(); i++) {
      self.cacheMemory.push(tag: i)
    }
  })

  self.replaceIt = function() {
    self.cacheMemory.replace(self.cacheMemory()[0], {h: "hashdashr44"});
    return 0;
  }

  self.cacheManagement = function() {
    cacheManagement = new CacheMemoryManagement(self.cacheSize(), self.addressesArray())
    cacheManagement.directMapping()
    //self.cacheMemory.replace(self.cacheMemory()[0], {h: 'cahchadchasdjofakjafsfsakhgsakh'})
    console.log(self.cacheMemory()[0])
  }
  
}

control = new CacheMemoryVM()
ko.applyBindings(control)