/* ДЗ 4 - работа с DOM */

/**
 * Функция должна создать элемент с тегом DIV, поместить в него текстовый узел и вернуть получившийся элемент
 *
 * @param {string} text - текст, который необходимо поместить в div
 * @return {Element}
 */
function createDivWithText(text) {
    var div = document.createElement("div"),
        textNode = document.createTextNode(text);

    div.appendChild(textNode);
    return div;
}

/**
 * Функция должна создать элемент с тегом A, установить значение для атрибута href и вернуть получившийся элемент
 *
 * @param {string} hrefValue - значение для атрибута href
 * @return {Element}
 */
function createAWithHref(hrefValue) {
    var a = document.createElement("a");
    a.href = hrefValue;
    return a;
}

/**
 * Функция должна вставлять элемент what в начало элемента where
 *
 * @param {Element} what - что вставлять
 * @param {Element} where - куда вставлять
 */
function prepend(what, where) {
    where.insertBefore(what, where.firstChild);
}

/**
 * Функция должна перебрать все дочерние элементы элемента where
 * и вернуть массив, состоящий из тех дочерних элементов
 * следующим соседом которых является элемент с тегом P
 * Рекурсия - по желанию
 *
 * @param {Element} where - где искать
 * @return {Array<Element>}
 *
 * @example
 * для html '<div></div><p></p><a></a><span></span><p></p>'
 * функция должна вернуть: [div, span]
 * т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    var filterArr = [],
        childs = where.children;
    for (var i = 0; i < childs.length - 1; i++) {
        if (childs[i].nextElementSibling.tagName === "P") {
          filterArr.push(childs[i]);
        }
    }
    return filterArr;
}

/**
 * Функция должна перебрать все дочерние узлы типа "элемент" внутри where
 * и вернуть массив, состоящий из текстового содержимого перебираемых элементов
 * Но похоже, что в код закралась ошибка, которую нужно найти и исправить
 *
 * @param {Element} where - где искать
 * @return {Array<string>}
 */
function findError(where) {
    var result = [];

    for (var child of where.children) {
        result.push(child.innerText);
    }

    return result;
}

/**
 * Функция должна перебрать все дочерние узлы элемента where
 * и удалить из него все текстовые узлы
 * Без рекурсии!
 * Будьте внимательны при удалении узлов,
 * можно получить неожиданное поведение при переборе узлов
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
 * должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
  var childs = where.childNodes;
  for (var i = 0; i < childs.length; i++) {
    if (childs[i].firstChild === null) {
      childs[i].parentNode.removeChild(childs[i]);
    }
  }
}

/**
 * Выполнить предудыщее задание с использование рекурсии
 * то есть необходимо заходить внутрь каждого дочернего элемента
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
 * должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
  var childs = where.childNodes;
  for (var i = 0; i < childs.length; i++) {
    if (childs[i].firstChild === null) {
      childs[i].parentNode.removeChild(childs[i]);
      i--;
    } else {
      deleteTextNodesRecursive(childs[i]);
    }
  }
}

/**
 * *** Со звездочкой ***
 * Необходимо собрать статистику по всем узлам внутри элемента root и вернуть ее в виде объекта
 * Статистика должна содержать:
 * - количество текстовых узлов
 * - количество элементов каждого класса
 * - количество элементов каждого тега
 * Для работы с классами рекомендуется использовать свойство classList
 * Постарайтесь не создавать глобальных переменных
 *
 * @param {Element} root - где собирать статистику
 * @return {{tags: Object<string, number>, classes: Object<string, number>, texts: number}}
 *
 * @example
 * для html <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
 * должен быть возвращен такой объект:
 * {
 *   tags: { DIV: 1, B: 2},
 *   classes: { "some-class-1": 2, "some-class-2": 1 },
 *   texts: 3
 * }
 */
var k = 0;

function countTags(where, tag) {
  var childs = where.children;
  for (var i = 0; i < childs.length; i++) {
    if (childs[i].tagName === tag) {
      k++;
    }
    countTags(childs[i], tag);
  }
  return k;
}

var l = 0;

function countClasses(where, cls) {
  var childs = where.children;
  for (var i = 0; i < childs.length; i++) {
    if (childs[i].classList.length) {
      for (var j = 0; j < childs[i].classList.length; j++) {
        if (childs[i].classList[j] === cls) {
          l++;
        }
      }
    }
    countClasses(childs[i], cls);
  }
  return l;
}

function collectDOMStat(root) {
  var obj = {
    tags: {

  },
    classes: {

  },
    texts: 0
  };

  tags(root, obj);
  classes(root, obj);
  texts(root, obj);

  for (var key in obj.tags) {
    var o = countTags(root, key);
    obj.tags[key] = countTags(root, key) - o;
  }

  for (var key in obj.classes) {
    var e = countClasses(root, key);
    obj.classes[key] = countClasses(root, key) - e;
  }

  function tags(root, obj) {
    var childs = root.childNodes;
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeType === 1) {
        obj.tags[childs[i].tagName] = 0;
        tags(childs[i], obj);
      }
    }
  }
  function classes(root, obj) {
    var childs = root.childNodes;
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeType === 1) {
        var classList = childs[i].classList;
        if (classList.length) {
          for (var j = 0; j < classList.length; j++) {
            obj.classes[classList[j]] = 0;
          }
        }
        classes(childs[i], obj);
      }
    }
  }

  function texts(root, obj) {
    var childs = root.childNodes;
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeType === 3) {
        obj.texts++;
      } else {
        texts(childs[i], obj);
      }
    }
  }

  return obj;
}
/**
 * *** Со звездочкой ***
 * Функция должна отслеживать добавление и удаление элементов внутри элемента where
 * Как только в where добавляются или удаляются элемента,
 * необходимо сообщать об этом при помощи вызова функции fn со специальным аргументом
 * В качестве аргумента должен быть передан объек с двумя свойствами:
 * - type: типа события (insert или remove)
 * - nodes: массив из удаленных или добавленных элементов (а зависимости от события)
 * Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов
 * Рекомендуется использовать MutationObserver
 *
 * @param {Element} where - где отслеживать
 * @param {function(info: {type: string, nodes: Array<Element>})} fn - функция, которую необходимо вызвать
 *
 * @example
 * если в where или в одного из его детей добавляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'insert',
 *   nodes: [div]
 * }
 *
 * ------
 *
 * если из where или из одного из его детей удаляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'remove',
 *   nodes: [div]
 * }
 */
function observeChildNodes(where, fn) {
}

export {
    createDivWithText,
    createAWithHref,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};
