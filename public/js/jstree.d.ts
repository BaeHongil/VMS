/**
 * Created by manager on 2016-08-18.
 */
interface JSTree {
    add_action(node_id: string, action: any);
    add_button(type: string, className: string, callback: Function);
    remove_button(type: string);
}