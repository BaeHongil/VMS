import { Component, ElementRef } from '@angular/core';
import { JsTree } from './jstree.component';
import { JstreeService } from './jstree.service';

@Component({
    selector: 'conn-jstree',
    template: '<div></div>'
})
export class ConnJsTree extends JsTree {
    constructor(
        elementRef: ElementRef,
        jstreeService: JstreeService) {
        super(elementRef, jstreeService);
    }

    ngOnInit() {
        super.ngOnInit();

        // 플레이어에서 스트리밍을 재생할 때
        this.jstreeService.streamingPlayed$.subscribe(
            playData => {
                let parentNodeJson = {
                    id : playData.index.toString(),
                    text : (playData.index+1) + '번 영상',
                    state : {opened : true}
                };
                this.createConnNode(playData.index, parentNodeJson, playData.liveNodeJson);
            }
        );

        this.jstreeService.playerSwaped$.subscribe(
            indexs => {
                this.swapNode(indexs.srcIndex, indexs.targetIndex);
            }
        );
    }

    selectNode(selNode: any) {
        this.jstreeService.selectConnNode(selNode);
    }

    createConnNode(index: number, parentNodeJson: Object, liveNodeJson: Object) {
        let parentNodeId = this.jsTree.create_node(null, parentNodeJson, index);
        let parentNode = this.jsTree.get_node(parentNodeId);
        this.jsTree.create_node(parentNode, liveNodeJson, 'last');
    }

    swapNode(srcIndex: number, targetIndex: number) {
        var rootNode = this.jsTree.get_node("#");
        var srcNode = this.jsTree.get_node(srcIndex);
        var targetNode = this.jsTree.get_node(targetIndex);

        if( srcNode && targetNode ) // 노드가 둘 다 존재시 ID 중복 방지
            this.jsTree.set_id(targetNode, '-10');
        if( srcNode )
            this.moveNode(rootNode, srcNode, targetIndex);
        if( targetNode )
            this.moveNode(rootNode, targetNode, srcIndex);
    }

    private moveNode(rootNode: any, srcNode: any, targetIndex: number) {
        this.jsTree.set_id(srcNode, targetIndex.toString());
        this.jsTree.rename_node( srcNode, (targetIndex + 1) + '번 영상' );
        this.jsTree.move_node( srcNode, rootNode, this.getNextNode(rootNode, targetIndex) );
    }

    private getNextNode(rootNode: any, id: number) {
        for(var i = 0; i < rootNode.children.length; i++) {
            if( rootNode.children[i] > id )
                return i;
        }
        return rootNode.children.length;
    }


}