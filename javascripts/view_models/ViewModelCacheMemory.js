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

function CacheMemoryManagement(cache_size, ramAddresses, sets) {
  self = this

  // Attributes
  self.cache = new Cache(parseInt(cache_size))
  self.ramAddresses = []
  self.iterations = []

  // 'Constructors' function for ramAddresses attribute
  self.cache.fill_blocks()
  for (var i in ramAddresses) { 
    self.ramAddresses.push(new RamAddress(ramAddresses[i].trim()))
  }

  self.saveInSets = function() {
    groupInSets = []
    var start = 0, countSet = 0, index = 0
    for (var i = 0; i < parseInt(cache_size / sets); i++, index += sets) {
      blocksSet = []
      for (var element = index; element < index +sets; element++) {
        blocksSet.push(self.cache.blocks[element])
      }
      groupInSets[countSet] = blocksSet
      countSet += 1
      start += 2
    }
    return groupInSets
  }

  self.emptySet = function(requestAddress, set, time) {
    var sets = self.saveInSets()
    for (var i in sets[set]) {
      if (sets[set][i].ramAddress === null) {
        sets[set][i].uses = time
        return parseInt(i)
      } else {
        if (sets[set][i].ramAddress === requestAddress) {
          sets[set][i].uses = time
          return parseInt(i)
        } 
      }
    }
    return sets[set]
  }

  // Methods of classes
  self.directMapping = function() {
    self.iterations = []
    for (var i in self.ramAddresses) {
      ramAddress = self.ramAddresses[i].ramAddress
      self.ramAddresses[i].state = is_hit(ramAddress) ? 'hit' : 'miss'
      var cacheAddress = ramAddress % self.cache.size
            
      if (isNaN(cacheAddress)) {
        alert('Inputs incorrectos (verficar el tamaño de la cache o las direcciones requeridas)')
      } else {
        self.ramAddresses[i].blockTag = cacheAddress
        self.cache.blocks[cacheAddress].ramAddress = ramAddress
        self.iterations.push(self.ramAddresses[i])
      }
    }
  }

  self.associativeCache = function(isFully) {
    self.iterations = []
    for (var i in self.ramAddresses) {
      ramAddress = self.ramAddresses[i].ramAddress
      self.ramAddresses[i].state = is_hit(ramAddress) ? 'hit' : 'miss'
      var blocksSet = isFully? 0 : ramAddress % sets
      blockEmpty = self.emptySet(ramAddress, blocksSet, parseInt(i))
      if(self.ramAddresses[i].state == 'miss') {
        if ($.isNumeric(blockEmpty)) {
          self.ramAddresses[i].blockTag = blocksSet + blockEmpty
          self.cache.blocks[blocksSet + blockEmpty].ramAddress = ramAddress
          //self.ramAddresses[blocksSet][blockEmpty].blockTag = cacheAddress
          //self.ramAddresses[i].blockTag = cacheAddress
        } else {
          var lru = []
          for(var j in blockEmpty) {
            lru.push(blockEmpty[j].uses)
          }
          lru.sort(function(a, b){ return a-b })
          for(var j = 0; j < blockEmpty.length; j++) {
            if (blockEmpty[j].uses === lru[0]) {
              self.cache.blocks[blocksSet + j].ramAddress = ramAddress
              self.cache.blocks[blocksSet + j].uses = i
              self.ramAddresses[i].blockTag = blocksSet + j
              break;
            }
          }
        }
      } else {
        self.ramAddresses[i].blockTag = blocksSet + blockEmpty
        self.cache.blocks[blocksSet + blockEmpty].ramAddress = ramAddress
      }
      self.iterations.push(self.ramAddresses[i])
    }
    console.log(self.iterations)
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
  var indexCache = 0
  self.currentAddress = 0
  self.change = true
  self.cacheSize = ko.observable(4)
  self.sets = ko.observable(2)
  self.ramAddresses = ko.observable("0\n8\n0\n6\n8")
  self.cacheMemory = ko.observableArray()
  self.contentCacheTable = ko.observableArray()
  self.iterateRam = ko.observableArray()
  self.gameType = ko.observable('')

  self.addressesArray = ko.computed(function() {
    return self.ramAddresses().trim().split('\n')
  })

  self.fillMemoryCache = ko.computed(function() {
    if(self.change === true) {
      self.cacheMemory([])
      for (var i = 0; i < self.cacheSize(); i++) {
        self.cacheMemory.push( {tag: i, select: false} )
      }
    } 
  })

  self.updateRam = ko.computed(function() {
    self.iterateRam([])
    console.log(self.iterateRam())
    for(var j = 0; j < self.addressesArray().length; j++) {
      self.iterateRam.push({data: self.addressesArray()[j], active: (self.currentAddress === j) ? true : false })
    }
  })

  self.replace = function(index, element) {
    self.cacheMemory.replace(self.cacheMemory()[index], element);
  }

  self.cacheDirect = function() {
    self.gameType('Direct')
    self.contentCacheTable([])
    cacheManagement = new CacheMemoryManagement(parseInt(self.cacheSize()), self.addressesArray(), self.sets())
    cacheManagement.directMapping()
    self.iterateOnCache()
    document.getElementById('menu').className = 'hide'
    location.href = "#cacheGame"
    document.getElementById('cacheGame').className = 'show'
  }

  self.cacheAssociative = function() {
    self.contentCacheTable([])
    cacheManagement = new CacheMemoryManagement(parseInt(self.cacheSize()), self.addressesArray(), parseInt(self.sets()))
    cacheManagement.associativeCache(false)
    self.iterateOnCache()
    document.getElementById('menu').className = 'hide'
    location.href = "#cacheGame"
    document.getElementById('cacheGame').className = 'show'
  }

  self.cacheFullAssociative = function() {
    self.contentCacheTable([])
    cacheManagement = new CacheMemoryManagement(parseInt(self.cacheSize()), self.addressesArray(), self.cacheSize())
    cacheManagement.associativeCache(true)
    self.iterateOnCache()
    document.getElementById('menu').className = 'hide'
    location.href = "#cacheGame"
    document.getElementById('cacheGame').className = 'show'
  }

  self.stop = function() {
    realIndex = indexCache  === 0 ? self.cacheSize() - 1 : indexCache - 1
    if (self.currentAddress != cacheManagement.ramAddresses.length) {
      if(self.correctAnswer(realIndex)) {
        console.log('estaa buenaaa hptaa')
        console.log(self.currentAddress)
        self.contentCacheTable.push(cacheManagement.iterations[self.currentAddress])
        self.currentAddress += 1
        if (self.currentAddress != cacheManagement.ramAddresses.length) {
          self.iterateRam.replace(self.iterateRam()[self.currentAddress], {data: self.iterateRam()[self.currentAddress].data, active: false})
        }
        if (self.currentAddress == cacheManagement.ramAddresses.length) {
          $.notify({
            message: 'You Win!!'
          })
          clearInterval(self.thread)
          setTimeout(function() {
            self.change = true
            self.currentAddress = 0
            document.getElementById('cacheGame').className = 'hide'
            document.getElementById('menu').className = 'show'
            location.href = "#menu"
          }, 3000)
        }
      }
    }
  }

  
  self.correctAnswer = function(address) {
    return cacheManagement.iterations[self.currentAddress].blockTag === address
  }

  self.iterateOnCache = function() {
    indexCache = 0
    self.change = false
    self.thread = setInterval(function() { 
      
      self.replace(indexCache, {tag: indexCache, select: true})
      if (indexCache  === self.cacheSize() - 1) {
        self.replace(indexCache - 1, {tag: indexCache - 1})
        indexCache = 0
      } else {
        indexCache === 0 ? self.replace(self.cacheSize() - 1, {tag: self.cacheSize() - 1}) : self.replace(indexCache - 1, {tag: indexCache - 1})
        indexCache =  indexCache + 1
      }      
    }, 1000)
  }
}

control = new CacheMemoryVM()
ko.applyBindings(control)

$( document ).ready(function() {
  document.getElementById('cacheGame').className = 'hide'
  document.getElementById('menu').className = 'show'

})
