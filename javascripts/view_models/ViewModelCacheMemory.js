//-------------- Classes  -------------- //
function Cache(size) {
  var self = this
  
  // Attributes
  self.size = size
  self.blocks = []
  
  // Methods
  self.fill_blocks = function() {
    for (i = 0; i < self.size; i++) {
      self.blocks.push(new Block(i))
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
  state = null
  block_tag = null  
}


//-------------- View-Model -------------- //

function CacheMemoryVM() {
  var self = this

  // Attributes
  self.ram = []
  self.size = ko.observable()
  self.ram_address = ko.observable()
  
  self.cache = ko.computed(function() {
    object = new Cache(self.size())
    object.fill_blocks()
    return object
  })

  self.ram_address = ko.computed(function() {
    
  })
}

control = new CacheMemoryVM()
ko.applyBindings(control)