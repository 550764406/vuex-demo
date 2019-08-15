/* @flow */

//第一步，先定义一个vnode的基类 这里有FunctionalRenderContext 函数里，这里需要返回一个vnode类型的数据，然后vnode再根据导出createElement来处理
/*
    createElement( {
    context: Component,  //当前节点的编译作用域
    tag: any,     //当前节点的标签名
    data: any,   //当前节点对象上包含data值
    children: any, //当前节点的子节点，为数组
    normalizationType: any, // 如果alwaysNormalize为true，则normalizationType标记为ALWAYS_NORMALIZE
    alwaysNormalize: boolean //如果当前为false，则表示还有子节点
    })
*/
export default class VNode {
    constructor (
        tag?: string,
        data?: VNodeData,
        children?: ?Array<VNode>,
        text?: string,
        elm?: Node,
        context?: Component,
        componentOptions?: VNodeComponentOptions
    ) {
    /*当前节点的标签名*/
    this.tag = tag
    /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.data = data
    /*当前节点的子节点，是一个数组*/
    this.children = children
    /*当前节点的文本*/
    this.text = text
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm
    /*当前节点的名字空间*/
    this.ns = undefined
    /*当前节点的编译作用域*/
    this.context = context
    /*函数化组件作用域*/
    this.functionalContext = undefined
    /*节点的key属性，被当作节点的标志，用以优化*/
    this.key = data && data.key
    /*组件的option选项*/
    this.componentOptions = componentOptions
    /*当前节点对应的组件的实例*/
    this.componentInstance = undefined
    /*当前节点的父节点*/
    this.parent = undefined
    /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.raw = false
    /*是否为静态节点*/
    this.isStatic = false
    /*是否作为跟节点插入*/
    this.isRootInsert = true
    /*是否为注释节点*/
    this.isComment = false
    /*是否为克隆节点*/
    this.isCloned = false
    /*是否有v-once指令*/
    this.isOnce = false
}

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    get child (): Component | void {
        return this.componentInstance
    }
}

//第二步 生成createElement方法
export function createElement (
    context: Component,
    tag: any,
    data: any,
    children: any,
    normalizationType: any,
    alwaysNormalize: boolean
): VNode {
    /*兼容不传data的情况*/
    if (Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }
    /*如果alwaysNormalize为true，则normalizationType标记为ALWAYS_NORMALIZE*/
    if (isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }
    /*Github:https://github.com/answershuto*/
    /*创建虚拟节点*/
    return _createElement(context, tag, data, children, normalizationType)
}

//第三步 创建虚拟节点
// 如果tag 为字符串，则判断是否为标签元素，或者子组件
// 如果tag 不为字符串，则有可能是组件
// 或者创建一个空的vnode 节点
export function _createElement (
    context: Component,
    tag?: string | Class<Component> | Function | Object,
    data?: VNodeData,
    children?: any,
    normalizationType?: number
): VNode {
    /*
      如果传递data参数且data的__ob__已经定义（代表已经被observed，上面绑定了Oberver对象），
      那么创建一个空节点
    */
    if (isDef(data) && isDef((data: any).__ob__)) {
        process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
        )
        return createEmptyVNode()
    }
    /*如果tag不存在也是创建一个空节点*/
    if (!tag) {
        // in case of component :is set to falsy value
        return createEmptyVNode()
    }
    // support single function children as default scoped slot
    /*默认默认作用域插槽*/
    if (Array.isArray(children) &&
        typeof children[0] === 'function') {
        data = data || {}
        data.scopedSlots = { default: children[0] }
        children.length = 0
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
        children = normalizeChildren(children)
    } else if (normalizationType === SIMPLE_NORMALIZE) {
        children = simpleNormalizeChildren(children)
    }
    let vnode, ns
    if (typeof tag === 'string') {
        let Ctor
        /*获取tag的名字空间*/
        ns = config.getTagNamespace(tag)
        /*判断是否是保留的标签*/
        if (config.isReservedTag(tag)) {
            // platform built-in elements
            /*如果是保留的标签则创建一个相应节点*/
            vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            )
        } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            // component
            /*从vm实例的option的components中寻找该tag，存在则就是一个组件，创建相应节点，Ctor为组件的构造类*/
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            /*未知的元素，在运行时检查，因为父组件可能在序列化子组件的时候分配一个名字空间*/
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            )
        }
    } else {
        // direct component options / constructor
        /*tag不是字符串的时候则是组件的构造类*/
        vnode = createComponent(tag, data, context, children)
    }
    if (isDef(vnode)) {
        /*如果有名字空间，则递归所有子节点应用该名字空间*/
        if (ns) applyNS(vnode, ns)
        return vnode
    } else {
        /*如果vnode没有成功创建则创建空节点*/
        return createEmptyVNode()
    }
}


/*
在进行diff算法时，是将所有的节点生成一个一维的对象来进行比较
 diff算法：判断vnode节点是否是同一节点，需要满足：
    1、key相同，
    2、tag(当前节点的标签名)相同，
    3、isComment(是否为注释节点)相同，是否data(包含节点对象的信息)定义，
    4、当前标签是input时，type必须相同
*/
/*创建一个空VNode节点*/
export const createEmptyVNode = () => {
    const node = new VNode()
    node.text = ''
    node.isComment = true
    return node
}

/*创建一个文本节点*/
export function createTextVNode (val: string | number) {
    return new VNode(undefined, undefined, undefined, String(val))
}

/*克隆一个VNode节点*/
export function cloneVNode (vnode: VNode): VNode {
    const cloned = new VNode(
        vnode.tag,
        vnode.data,
        vnode.children,
        vnode.text,
        vnode.elm,
        vnode.context,
        vnode.componentOptions
    )
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    cloned.isCloned = true
    return cloned
}

/*对一个节点数组依次进行clone*/
export function cloneVNodes (vnodes: Array<VNode>): Array<VNode> {
    const len = vnodes.length
    const res = new Array(len)
    for (let i = 0; i < len; i++) {
        res[i] = cloneVNode(vnodes[i])
    }
    return res
}

//template模板编译
//1、编译成render和renderStaticRender字符串模板，返回vnode节点
// 2、生成AST语法树 通过optimze函数优化，通过generous函数返回上面的字符串模板