define([ 
"dojo/_base/lang",//
"gform/EditorFactory", //
"gform/AttributeFactoryFinder",//
"gform/group/GroupFactory",//
"gform/group/ListPaneGroupFactory",//
"gform/group/TabGroupFactory",//
"gform/group/TitlePaneGroupFactory",//
"gform/group/ListGroupFactory",//
"gform/list_primitive/PrimitiveListAttributeFactory",//
"gform/list_primitive/RefListAttributeFactory",//
"gform/primitive/StringAttributeFactory",//
"gform/primitive/BooleanAttributeFactory",//
"gform/primitive/SelectAttributeFactory",//
"gform/primitive/CheckedSelectAttributeFactory",//
"gform/primitive/MappedCheckedMultiSelectAttributeFactory",//
"gform/primitive/CheckedMultiSelectAttributeFactory",//
"gform/primitive/MappedSelectAttributeFactory",//
"gform/primitive/DateAttributeFactory",//
"gform/primitive/TimeAttributeFactory",//
"gform/embedded/EmbeddedAttributeFactory",//
"gform/primitive/TextareaAttributeFactory",//
"gform/primitive/SimpleTextareaAttributeFactory",//
"gform/primitive/NumberAttributeFactory",//
"gform/primitive/CurrencyAmountAttributeFactory",//
"gform/primitive/MappedContentPaneFactory",//
"gform/primitive/ReferenceAttributeFactory",//
"gform/group/AttributeListWidget",//
"gform/group/ColumnsGroupFactory",//
"gform/map_embedded/RepeatedEmbeddedAttributeFactory",//
"gform/list_embedded/RepeatedEmbeddedAttributeFactory",//,
"gform/map_primitive/PrimitiveMapAttributeFactory",//
"gform/list_table/RepeatedEmbeddedAttributeFactory"

], function(lang,EditorFactory,AttributeFactoryFinder, GroupFactory, ListPaneGroupFactory, TabGroupFactory, //
		TitlePaneGroupFactory, ListGroupFactory,PrimitiveListAttributeFactory, RefListAttributeFactory, StringAttributeFactory,
		BooleanAttributeFactory, SelectAttributeFactory, CheckedSelectAttributeFactory, 
		MappedCheckedMultiSelectAttributeFactory,
		CheckedMultiSelectAttributeFactory, MappedSelectAttributeFactory, DateAttributeFactory, 
		TimeAttributeFactory, EmbeddedAttributeFactory, TextareaAttributeFactory, SimpleTextareaAttributeFactory, NumberAttributeFactory, 
		CurrencyAmountAttributeFactory, MappedContentPaneFactory, ReferenceAttributeFactory,
		AttributeListWidget, ColumnsGroupFactory, MapAttributeFactory, RepeatedEmbeddedAttributeFactory, PrimitiveMapAttributeFactory, TableListAttributeFactory) {
// module:
//		gform/createLayoutEditorFactory

			var editorFactory = new EditorFactory();
			editorFactory.addGroupFactory("listpane", new ListPaneGroupFactory({editorFactory:editorFactory}));
//			editorFactory.addGroupFactory("listgroup", new ListGroupFactory({editorFactory:editorFactory}));
//			editorFactory.addGroupFactory("tab", new TabGroupFactory({editorFactory:editorFactory}));
//			editorFactory.addGroupFactory("titlepane", new TitlePaneGroupFactory({editorFactory:editorFactory}));
//			editorFactory.addGroupFactory("columnsgroup", new ColumnsGroupFactory({editorFactory:editorFactory}));
			editorFactory.set("defaultGroupFactory",new ListPaneGroupFactory({editorFactory:editorFactory}));

			var attributeFactoryFinder = new AttributeFactoryFinder({
				editorFactory : editorFactory
			});

			var attributeFactories = [ //
			       				new RepeatedEmbeddedAttributeFactory({editorFactory:editorFactory}),//
//			       				new MapAttributeFactory({editorFactory:editorFactory}),//
//			       				new PrimitiveMapAttributeFactory({editorFactory:editorFactory}),//
//			       				new EmbeddedAttributeFactory({editorFactory:editorFactory}),//
//			       				new MappedCheckedMultiSelectAttributeFactory({editorFactory:editorFactory}), // 
//			       				new CheckedMultiSelectAttributeFactory({editorFactory:editorFactory}), // 
//			       				new MappedSelectAttributeFactory({editorFactory:editorFactory}),//
//			       				new RefListAttributeFactory({editorFactory:editorFactory}),//
			       				new PrimitiveListAttributeFactory({editorFactory:editorFactory}),//
//			       				new NumberAttributeFactory({editorFactory:editorFactory}),//
			       				new ReferenceAttributeFactory({editorFactory:editorFactory}), //
//			       				new SelectAttributeFactory({editorFactory:editorFactory}), // 
//			       				new BooleanAttributeFactory({editorFactory:editorFactory}), // 
			       				new StringAttributeFactory({editorFactory:editorFactory}), //
//			       				new MappedContentPaneFactory({editorFactory:editorFactory}) //
			       				];
//			attributeFactoryFinder.addAttributeFactory("table", new TableListAttributeFactory({editorFactory:editorFactory}));
//			attributeFactoryFinder.addAttributeFactory("primitive_list", new PrimitiveListAttributeFactory({editorFactory:editorFactory}));
//			attributeFactoryFinder.addAttributeFactory("textarea", new TextareaAttributeFactory({editorFactory:editorFactory}));
//			attributeFactoryFinder.addAttributeFactory("simpletextarea", new SimpleTextareaAttributeFactory({editorFactory:editorFactory}));
//			attributeFactoryFinder.addAttributeFactory("checked_select",new CheckedSelectAttributeFactory({editorFactory:editorFactory}));
			attributeFactoryFinder.set("attributeFactories",attributeFactories);

			editorFactory.set("attributeFactoryFinder",attributeFactoryFinder);
		
			return function() {
				// summary:
				//		LayoutEditorFactory will created ListPanes as default group. These work well in LayoutContainers
				// returns: gform/EditorFactory
				//		return the cached editorFactory instance.
				return editorFactory;
			}				

});
