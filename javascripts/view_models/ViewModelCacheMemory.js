//-------------- Classes  -------------- //
function Cache(size) {
  var self = this
  
  // Attributes
  self.size = size
  self.blocks = []
  
  // Methods
  self.fill_blocks = function() {
    if (self.size <= 1024) {
      for (i = 0; i < self.size; i++) {
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
  self.ram_address = null
}

function RamAddress(ram_address) {
  var self = this

  // Attributes
  self.ram_address = ram_address
  self.state = null
  self.block_tag = null
}

function CacheMemoryManagement(cache_size, ram_addresses) {
  self = this

  // Attributes
  self.cache = new Cache(cache_size)
  self.ram_addresses = []

  // 'Constructors' function for ram_addresses attribute
  self.cache.fill_blocks()
  for (i in ram_addresses) { 
    self.ram_addresses.push(new RamAddress(ram_addresses[i].trim()))
  }

  // Methods of classes
  self.direct_mapping = function() {
    for (i in self.ram_addresses) {
      ram_address = self.ram_addresses[i].ram_address
      console.log(self.ram_addresses[i])
      var st = (is_hit(ram_address) == true) ? 'hit' : 'miss';
      console.log(self.ram_addresses[i].state())
      cache_address = Number(ram_address) % Number(self.cache.size)
      

      if (isNaN(cache_address)) {
        alert('Inputs incorrectos (verficar el tamaño de la cache o las direcciones requeridas)')
      } else {
        console.log(cache_address)
      }
    }
  }

  // 'privates' Methods
  function is_hit(ram_address) {
    for (i in self.cache.blocks) {
      if (self.cache.blocks[i].ram_address == ram_address) {
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
  self.cache_size = ko.observable(0)
  self.ram_addresses = ko.observable('')
  
  self.addresses_array = ko.computed(function() {
    return self.ram_addresses().trim().split('\n')
  })

  self.cache_management = function() {
    cache_management = new CacheMemoryManagement(self.cache_size(), self.addresses_array())
    cache_management.direct_mapping()
  }
}

control = new CacheMemoryVM()
ko.applyBindings(control)